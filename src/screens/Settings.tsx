/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';

import {AllTypesOptions, ListPlayMode, StackParamList} from '../../App';

type SettingsScreenNavigationProp = StackNavigationProp<
  StackParamList,
  'Settings'
>;

type Props = {
  navigation: SettingsScreenNavigationProp;
  generatorOption: (type: AllTypesOptions) => void;
  listplayMode: ListPlayMode;
  mode: string;
};

const iconsType = {
  Bullet: 'bullet',
  Rapid: 'rabbit',
  Blitz: 'fire',
  Classical: 'tortoise',
};

export default function Settings({
  generatorOption,
  listplayMode,
  mode,
}: Props): JSX.Element {
  return (
    <View>
      <FlatList
        data={listplayMode}
        keyExtractor={(_, index) => `${index}`}
        renderItem={({item}) => (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              borderBottomColor: '#ccc',
              borderBottomWidth: 0.5,
              padding: 15,
              backgroundColor: mode === item.name ? '#ededed' : '#fff',
            }}
            onPress={() => generatorOption(item.name)}>
            <Text>{iconsType[item.type]}</Text>
            <Text style={{marginHorizontal: 10}}> {item.type} </Text>
            <Text>{item.name}</Text>
            {mode === item.name && <Text style={{marginLeft: 'auto'}}>✓</Text>}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
