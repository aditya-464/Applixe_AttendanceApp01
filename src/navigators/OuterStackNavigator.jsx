import {Easing, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import DrawerNavigator from './DrawerNavigator';
import EmailVerificationScreen from '../screens/EmailVerificationScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {saveAuthDetails} from '../redux/auth';

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

const OuterStackNavigator = props => {
  const {handleSplashScreenHide} = props;
  const [gotUid, setGotUid] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const getAsyncStorageData = async () => {
        const uid = await AsyncStorage.getItem('uid');
        if (uid === null) {
          setGotUid(false);
        } else {
          setGotUid(true);
          dispatch(saveAuthDetails(uid));
        }
        handleSplashScreenHide();
      };
      getAsyncStorageData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <NavigationContainer>
      {gotUid !== null && (
        <Stack.Navigator
          screenOptions={{
            transitionSpec: {
              open: config,
              close: closeConfig,
            },
            cardStyleInterpolator:
              CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
          initialRouteName={gotUid == true ? 'DrawerNavigator' : 'Welcome'}>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EmailVerificationScreen"
            component={EmailVerificationScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ForgotPasswordScreen"
            component={ForgotPasswordScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DrawerNavigator"
            component={DrawerNavigator}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default OuterStackNavigator;

const styles = StyleSheet.create({});
