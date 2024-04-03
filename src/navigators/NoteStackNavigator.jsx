import {Easing} from 'react-native';
import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import NotesScreen from '../screens/NotesScreen';
import CreateNoteScreen from '../screens/CreateNoteScreen';
import ViewNoteScreen from '../screens/ViewNoteScreen';

const Stack = createStackNavigator();

const config = {
  animation: 'spring',
  config: {
    stiffness: 500,
    damping: 50,
    mass: 3,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const closeConfig = {
  animation: 'timing',
  config: {
    duration: 200,
    easing: Easing.linear,
  },
};

const NoteStackNavigator = () => {
  return (
      <Stack.Navigator
        screenOptions={{
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
        initialRouteName="NotesScreen">
        <Stack.Screen
          name="NotesScreen"
          component={NotesScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CreateNoteScreen"
          component={CreateNoteScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ViewNoteScreen"
          component={ViewNoteScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
  );
};

export default NoteStackNavigator;
