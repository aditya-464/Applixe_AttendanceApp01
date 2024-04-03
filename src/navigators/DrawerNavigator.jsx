import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeStackNavigator from './HomeStackNavigator';
import NoteStackNavigator from './NoteStackNavigator';
import ProfileScreen from '../screens/ProfileScreen';
import LogoutScreen from '../screens/LogoutScreen';
import AboutScreen from '../screens/AboutScreen';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../themes/Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="HomeStackNavigator"
      screenOptions={{
        drawerPosition: 'right',
        drawerLabelStyle: {
          fontFamily: FONTFAMILY.poppins_medium,
          fontSize: FONTSIZE.size_18,
          color: COLORS.primaryDark,
        },
        drawerActiveBackgroundColor: COLORS.drawerItem,
        drawerItemStyle: {
          paddingLeft: SPACING.space_8,
          marginHorizontal: SPACING.space_16,
          borderRadius: 5,
        },
        drawerType: 'front',
      }}>
      <Drawer.Screen
        name="HomeStackNavigator"
        component={HomeStackNavigator}
        options={{
          headerShown: false,
          drawerLabel: 'Home',
          drawerIcon: () => (
            <Ionicons
              name="home-outline"
              size={24}
              color={COLORS.primaryDark}></Ionicons>
          ),
        }}
      />
      <Drawer.Screen
        name="NoteStackNavigator"
        component={NoteStackNavigator}
        options={{
          headerShown: false,
          drawerLabel: 'Notes',
          drawerIcon: () => (
            <Ionicons
              name="document-text-outline"
              size={24}
              color={COLORS.primaryDark}></Ionicons>
          ),
        }}
      />
      <Drawer.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: false,
          drawerLabel: 'Profile',
          drawerIcon: () => (
            <SimpleLineIcons
              name="user"
              size={24}
              color={COLORS.primaryDark}></SimpleLineIcons>
          ),
        }}
      />
      <Drawer.Screen
        name="AboutScreen"
        component={AboutScreen}
        options={{
          headerShown: false,
          drawerLabel: 'About',
          drawerIcon: () => (
            <Ionicons
              name="information-circle-outline"
              size={26}
              color={COLORS.primaryDark}></Ionicons>
          ),
        }}
      />
      <Drawer.Screen
        name="LogoutScreen"
        component={LogoutScreen}
        options={{
          headerShown: false,
          drawerLabel: 'Logout',
          drawerIcon: () => (
            <SimpleLineIcons
              name="logout"
              size={24}
              color={COLORS.primaryDark}></SimpleLineIcons>
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
