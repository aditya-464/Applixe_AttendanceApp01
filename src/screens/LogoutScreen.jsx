import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../themes/Theme';
import {DrawerActions} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {removeAuthDetails} from '../redux/auth';
// import {useNetInfo} from '@react-native-community/netinfo';

const LogoutScreen = props => {
  const {navigation} = props;
  const [showLoader, setShowLoader] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  // const {isConnected} = useNetInfo();

  const clearAllStoredData = async () => {
    try {
      await AsyncStorage.removeItem('name');
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('uid');
      await AsyncStorage.removeItem('password');
      dispatch(removeAuthDetails());
      setShowLoader(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      setShowLoader(true);
      await auth()
        .signOut()
        .then(() => {
          clearAllStoredData();
          navigation.reset({
            index: 0,
            routes: [{name: 'Welcome'}],
          });
        })
        .catch(error => {
          setError(error.message);
          setShowLoader(false);
        });
    } catch (error) {
      setError(error.message);
      setShowLoader(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.primaryLight}}>
      <View style={styles.TitleBar}>
        <View style={styles.Title}>
          <Text style={styles.TitleText}>Logout</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          activeOpacity={0.6}
          style={styles.Menu}>
          <Ionicons
            name="menu"
            size={FONTSIZE.size_30}
            color={COLORS.primaryDark}></Ionicons>
        </TouchableOpacity>
      </View>
      <View style={styles.LogoutContent}>
        <Text style={styles.LogoutInfoText}>
          Are you certain you wish to Logout?
        </Text>
        <View style={styles.ActionButtons}>
          <TouchableOpacity
            onPress={() => navigation.navigate('HomeStackNavigator')}
            activeOpacity={0.6}
            style={styles.NoButton}>
            <Text style={styles.NoButtonText}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleLogout();
            }}
            activeOpacity={0.6}
            style={styles.YesButton}>
            {!showLoader && <Text style={styles.YesButtonText}>Yes</Text>}
            {showLoader && (
              <ActivityIndicator
                size={26}
                color={COLORS.primaryLight}
                animating={showLoader}
              />
            )}
          </TouchableOpacity>
          {error && <Text style={styles.ErrorText}>{error}</Text>}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LogoutScreen;

const styles = StyleSheet.create({
  TitleBar: {
    width: '100%',
    paddingHorizontal: SPACING.space_12,
    paddingVertical: SPACING.space_8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Title: {
    width: '80%',
  },
  TitleText: {
    fontFamily: FONTFAMILY.poppins_bold,
    fontSize: FONTSIZE.size_30,
    color: COLORS.primaryDark,
  },
  Menu: {
    width: '20%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: SPACING.space_4,
  },
  LogoutContent: {
    padding: SPACING.space_16,
    marginTop: SPACING.space_20,
  },
  LogoutInfoText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryDark,
    textAlign: 'center',
  },
  ActionButtons: {
    marginTop: SPACING.space_24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  NoButton: {
    width: '48%',
    padding: SPACING.space_12,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
    borderRadius: 50,
  },
  NoButtonText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryDark,
    textAlign: 'center',
  },
  YesButton: {
    width: '48%',
    padding: SPACING.space_12,
    backgroundColor: COLORS.primaryDark,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
    borderRadius: 50,
  },
  YesButtonText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLight,
    textAlign: 'center',
  },
  ErrorText: {
    textAlign: 'center',
    marginTop: SPACING.space_10,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.absent,
  },
});
