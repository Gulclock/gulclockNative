/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import MusicControl, {Command} from 'react-native-music-control';

import {BaseOptions, StackParamList} from '../../App';

export const usePrevious = (value: BaseOptions | undefined) => {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

type ClockScreenNavigationProp = StackNavigationProp<StackParamList, 'Clock'>;

type Props = {
  navigation: ClockScreenNavigationProp;
  activeMode: BaseOptions;
};

export default function Clock({navigation, activeMode}: Props): JSX.Element {
  type Player = {
    steps: number;
    timeLeft: number;
    paused: boolean;
    increment: number;
  };

  type Orientation = 'portrait' | 'landscape';

  const activeModePrevius = usePrevious(activeMode);

  const {timeLeft, increment} = activeMode;

  const initialState = {
    steps: 0,
    timeLeft,
    increment,
    paused: true,
  };

  const [orientation, setOrientation] = React.useState<Orientation>('portrait');

  const [playerTopOrLeft, setPlayerTopOrLeft] = React.useState<Player>(
    initialState,
  );

  const [playerBottomOrRight, setPlayerBottomOrRight] = React.useState<Player>(
    initialState,
  );

  const [gameOver, setGameOver] = React.useState<boolean>(false);

  React.useEffect(() => {
    MusicControl.enableControl('volume', true); // Only affected when remoteVolume is enabled
    MusicControl.enableControl('remoteVolume', false);
    MusicControl.enableBackgroundMode(true);

    // on iOS, pause playback during audio interruptions (incoming calls) and resume afterwards.
    // As of {{ INSERT NEXT VERSION HERE}} works for android aswell.
    MusicControl.handleAudioInterruptions(true);

    MusicControl.on(Command.play, () => {
      Alert.alert('play');
    });

    // on iOS this event will also be triggered by audio router change events
    // happening when headphones are unplugged or a bluetooth audio peripheral disconnects from the device
    MusicControl.on(Command.pause, () => {
      Alert.alert('pause');
    });

    MusicControl.on(Command.stop, () => {
      Alert.alert('stop');
    });

    MusicControl.on(Command.nextTrack, () => {
      Alert.alert('nextTrack');
    });

    MusicControl.on(Command.previousTrack, () => {
      Alert.alert('previousTrack');
    });

    MusicControl.on(Command.changePlaybackPosition, () => {
      Alert.alert('changePlaybackPosition');
    });

    MusicControl.on(Command.seekForward, () => {});
    MusicControl.on(Command.seekBackward, () => {});

    MusicControl.on(Command.skipForward, () => {});
    MusicControl.on(Command.skipBackward, () => {});
    MusicControl.on(Command.volume, (volume) => {
      Alert.alert(volume);
    });
  }, []);

  const startplayerBottomOrRight = () => {
    setPlayerTopOrLeft({
      ...playerTopOrLeft,
      paused: false,
      steps: playerTopOrLeft.steps + 1,
    });
    setPlayerBottomOrRight({
      ...playerBottomOrRight,
      paused: true,
      timeLeft:
        playerBottomOrRight.steps === 0
          ? playerBottomOrRight.timeLeft
          : playerBottomOrRight.timeLeft + playerBottomOrRight.increment,
    });
  };

  const startPlayerTopOrLeft = () => {
    setPlayerBottomOrRight({
      ...playerBottomOrRight,
      paused: false,
      steps: playerBottomOrRight.steps + 1,
    });
    setPlayerTopOrLeft({
      ...playerTopOrLeft,
      paused: true,
      timeLeft:
        playerTopOrLeft.steps === 0
          ? playerTopOrLeft.timeLeft
          : playerTopOrLeft.timeLeft + playerTopOrLeft.increment,
    });
  };

  const reset = () => {
    setPlayerBottomOrRight(initialState);
    setPlayerTopOrLeft(initialState);
    setGameOver(false);
  };

  const formatterTime = (time: number) =>
    new Date(time * 1000).toISOString().substr(14, 5);

  React.useEffect(() => {
    const id = setInterval(() => {
      setPlayerTopOrLeft({
        ...playerTopOrLeft,
        timeLeft: playerTopOrLeft.timeLeft - 1,
      });
    }, 1000);
    if (playerTopOrLeft.timeLeft === 0) {
      clearInterval(id);
      setGameOver(true);
    }
    if (playerTopOrLeft.paused) {
      clearInterval(id);
    }

    return () => clearInterval(id);
  }, [playerTopOrLeft, playerTopOrLeft.paused]);

  React.useEffect(() => {
    const id = setInterval(() => {
      setPlayerBottomOrRight({
        ...playerBottomOrRight,
        timeLeft: playerBottomOrRight.timeLeft - 1,
      });
    }, 1000);
    if (playerBottomOrRight.timeLeft === 0) {
      clearInterval(id);
      setGameOver(true);
    }
    if (playerBottomOrRight.paused) {
      clearInterval(id);
    }

    return () => clearInterval(id);
  }, [playerBottomOrRight, playerBottomOrRight.paused]);

  React.useEffect(() => {
    if (activeModePrevius !== activeMode) {
      reset();
    }
  }, [activeMode]);

  // React.useEffect(() => {
  //   const listener = (info: ScreenOrientation.OrientationChangeEvent): void => {
  //     setOrientation(
  //       info.orientationInfo.orientation === 1 ? 'portrait' : 'landscape',
  //     );
  //   };

  //   ScreenOrientation.addOrientationChangeListener(listener);
  //   return () => {
  //     ScreenOrientation.removeOrientationChangeListeners();
  //   };
  // }, []);

  return (
    <>
      <SafeAreaView />
      <View style={styles.container}>
        {orientation === 'portrait' ? (
          <>
            <Pressable
              disabled={gameOver}
              onPressIn={startPlayerTopOrLeft}
              style={{flex: 1, width: '100%'}}>
              <View
                style={[
                  styles.touchView,
                  {
                    transform: [{rotate: '180deg'}],
                    backgroundColor:
                      playerTopOrLeft.timeLeft === 0
                        ? 'red'
                        : playerTopOrLeft.paused
                        ? '#c0c0c0'
                        : 'darkorange',
                  },
                ]}>
                <Text
                  style={[
                    styles.text,
                    {color: playerTopOrLeft.paused ? '#000' : '#c0c0c0'},
                  ]}>
                  {formatterTime(playerTopOrLeft.timeLeft)}
                </Text>
                <Text style={{position: 'absolute', right: 15, bottom: 15}}>
                  {playerTopOrLeft.steps}
                </Text>
              </View>
            </Pressable>
            <View
              style={{
                flexDirection: 'row',
                padding: 25,
                backgroundColor: '#333',
                width: '100%',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity onPress={reset}>
                <Text>RELOAD</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                <Text>Settings</Text>
              </TouchableOpacity>
            </View>
            <Pressable
              disabled={gameOver}
              onPressIn={startplayerBottomOrRight}
              style={{flex: 1, width: '100%'}}>
              <View
                style={[
                  styles.touchView,
                  {
                    backgroundColor:
                      playerBottomOrRight.timeLeft === 0
                        ? 'red'
                        : playerBottomOrRight.paused
                        ? '#c0c0c0'
                        : 'darkorange',
                  },
                ]}>
                <Text
                  style={[
                    styles.text,
                    {color: playerBottomOrRight.paused ? '#000' : '#c0c0c0'},
                  ]}>
                  {formatterTime(playerBottomOrRight.timeLeft)}
                </Text>
                <Text style={{position: 'absolute', right: 15, bottom: 15}}>
                  {playerBottomOrRight.steps}
                </Text>
              </View>
            </Pressable>
          </>
        ) : (
          <>
            <View
              style={{
                flexDirection: 'row',
                padding: 25,
                backgroundColor: '#333',
                width: '100%',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity onPress={reset}>
                <Text>RELOAD</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                <Image
                  source={require('../images/images.png')}
                  style={{marginRight: 20}}
                />
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', flex: 1}}>
              <Pressable
                disabled={gameOver}
                onPressIn={startPlayerTopOrLeft}
                style={{flex: 1, width: '100%'}}>
                <View
                  style={[
                    styles.touchView,
                    {
                      backgroundColor:
                        playerTopOrLeft.timeLeft === 0
                          ? 'red'
                          : playerTopOrLeft.paused
                          ? '#c0c0c0'
                          : 'darkorange',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.text,
                      {color: playerTopOrLeft.paused ? '#000' : '#c0c0c0'},
                    ]}>
                    {formatterTime(playerTopOrLeft.timeLeft)}
                  </Text>
                  <Text style={{position: 'absolute', right: 15, bottom: 15}}>
                    {playerTopOrLeft.steps}
                  </Text>
                </View>
              </Pressable>
              <Pressable
                disabled={gameOver}
                onPressIn={startplayerBottomOrRight}
                style={{flex: 1, width: '100%'}}>
                <View
                  style={[
                    styles.touchView,
                    {
                      backgroundColor:
                        playerBottomOrRight.timeLeft === 0
                          ? 'red'
                          : playerBottomOrRight.paused
                          ? '#c0c0c0'
                          : 'darkorange',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: playerBottomOrRight.paused ? '#000' : '#c0c0c0',
                      },
                    ]}>
                    {formatterTime(playerBottomOrRight.timeLeft)}
                  </Text>
                  <Text style={{position: 'absolute', right: 15, bottom: 15}}>
                    {playerBottomOrRight.steps}
                  </Text>
                </View>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 80,
  },
  touchView: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
