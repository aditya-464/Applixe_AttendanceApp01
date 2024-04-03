import {Platform, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import OuterStackNavigator from './src/navigators/OuterStackNavigator';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  const handleSplashScreenHide = () => {
    if (Platform.OS === 'android') {
      SplashScreen.hide();
    }
  };

  // useEffect(() => {

  // }, []);

  return (
    <Provider store={store}>
      <OuterStackNavigator
        handleSplashScreenHide={handleSplashScreenHide}></OuterStackNavigator>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
