/* eslint-disable react/jsx-props-no-spreading */
import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Clock from './src/screens/Clock';
import Settings from './src/screens/Settings';

export type StackParamList = {
  Clock: undefined;
  Settings: undefined;
};

export type BulletOptions = '1+0' | '2+1';
export type BlitzOptions = '3+0' | '3+2' | '5+0' | '5+3';
export type RapidOptions = '10+0' | '10+5' | '15+10';
export type ClassicalOptions = '30+0' | '30+20';

export type AllTypesOptions =
  | BulletOptions
  | BlitzOptions
  | RapidOptions
  | ClassicalOptions;

export type BaseOptions = {
  timeLeft: number;
  increment: number;
  type: 'Bullet' | 'Blitz' | 'Rapid' | 'Classical';
};

export type PlayMode = {
  [k in AllTypesOptions]: BaseOptions;
};

export const playMode: PlayMode = {
  '1+0': {timeLeft: 60, increment: 0, type: 'Bullet'},
  '2+1': {timeLeft: 120, increment: 1, type: 'Bullet'},
  '3+0': {timeLeft: 180, increment: 0, type: 'Blitz'},
  '3+2': {timeLeft: 180, increment: 2, type: 'Blitz'},
  '5+0': {timeLeft: 300, increment: 0, type: 'Blitz'},
  '5+3': {timeLeft: 300, increment: 3, type: 'Blitz'},
  '10+0': {timeLeft: 600, increment: 0, type: 'Rapid'},
  '10+5': {timeLeft: 600, increment: 5, type: 'Rapid'},
  '15+10': {timeLeft: 900, increment: 10, type: 'Rapid'},
  '30+0': {timeLeft: 1800, increment: 0, type: 'Classical'},
  '30+20': {timeLeft: 1800, increment: 20, type: 'Classical'},
};

type TransformPlayMode = {
  name: AllTypesOptions;
  type: BaseOptions['type'];
};

export type ListPlayMode = TransformPlayMode[];

const Stack = createStackNavigator();

const listPlayMode = (arreglo: PlayMode): ListPlayMode => {
  const transform: AllTypesOptions[] = Object.keys(arreglo) as Array<
    keyof typeof arreglo
  >;
  const result = transform.map((item) => ({
    name: item,
    type: arreglo[item].type,
  }));
  return result;
};

export default function App(): JSX.Element {
  const [activeMode, setActiveMode] = React.useState({
    playmode: playMode['3+2'],
    mode: '3+2',
  });

  const generatorOption = (type: AllTypesOptions): void => {
    setActiveMode({playmode: playMode[type], mode: type});
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Clock">
        <Stack.Screen name="Clock" options={{headerShown: false}}>
          {(props) => <Clock activeMode={activeMode.playmode} {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Settings">
          {(props) => (
            <Settings
              generatorOption={generatorOption}
              listplayMode={listPlayMode(playMode)}
              mode={activeMode.mode}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
