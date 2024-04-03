import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../themes/Theme';
import {DrawerActions} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = props => {
  const {navigation} = props;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [error, setError] = useState(null);

  const getLoggedInUserInfo = async () => {
    try {
      const userName = await AsyncStorage.getItem('name');
      const userEmail = await AsyncStorage.getItem('email');
      const userPassword = await AsyncStorage.getItem('password');

      if (userName && userEmail && userPassword) {
        setShowLoader(false);
        setName(userName);
        setEmail(userEmail);
        setPassword(userPassword);
      }
    } catch (error) {
      setError(error.message);
      setShowLoader(false);
    }
  };

  useEffect(() => {
    getLoggedInUserInfo();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.primaryLight}}>
      <View style={styles.TitleBar}>
        <View style={styles.Title}>
          <Text style={styles.TitleText}>Profile</Text>
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
      {!showLoader && (
        <ScrollView style={styles.ProfileContent}>
          <Text style={styles.PlaceholderText}>Name</Text>
          <TextInput
            autoCorrect={false}
            style={styles.Name}
            editable={false}
            value={name}
            onChangeText={text => setName(text)}></TextInput>
          <Text style={styles.PlaceholderText}>Email</Text>
          <TextInput
            autoCorrect={false}
            style={styles.Email}
            editable={false}
            value={email}
            onChangeText={text => setEmail(text)}></TextInput>
          <Text style={styles.PlaceholderText}>Password</Text>
          <View style={styles.PasswordContainer}>
            <TextInput
              autoCorrect={false}
              secureTextEntry={!showPassword}
              style={styles.Password}
              maxLength={20}
              editable={false}
              value={password}
              onChangeText={text => setPassword(text)}></TextInput>
            <View>
              <TouchableOpacity
                onPress={() => setShowPassword(prev => !prev)}
                activeOpacity={0.6}
                style={styles.PasswordIconButton}>
                <Ionicons
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={FONTSIZE.size_24}
                  color={COLORS.placeholder}></Ionicons>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
      {showLoader && (
        <View
          style={{
            marginTop: SPACING.space_15,
            paddingHorizontal: SPACING.space_12,
          }}>
          <ActivityIndicator
            size={30}
            color={COLORS.placeholder}
            animating={showLoader}
          />
        </View>
      )}
      {error && (
        <View
          style={{
            marginTop: SPACING.space_15,
            paddingHorizontal: SPACING.space_12,
          }}>
          <Text style={styles.ErrorText}>{error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;

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
  ProfileContent: {
    paddingHorizontal: SPACING.space_16,
    paddingTop: SPACING.space_4,
  },
  PlaceholderText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.placeholder,
    marginBottom: SPACING.space_4,
  },
  Name: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryDark,
    padding: SPACING.space_12,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
    borderRadius: BORDERRADIUS.radius_4,
    marginBottom: SPACING.space_18,
  },
  Email: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryDark,
    padding: SPACING.space_12,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
    borderRadius: BORDERRADIUS.radius_4,
    marginBottom: SPACING.space_18,
  },
  PasswordContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
    borderRadius: BORDERRADIUS.radius_4,
    marginBottom: SPACING.space_18,
  },
  Password: {
    minWidth: '70%',
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryDark,
    padding: SPACING.space_12,
  },
  PasswordIconButton: {
    paddingHorizontal: SPACING.space_12,
  },
  ActionButtons: {
    marginTop: SPACING.space_24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  EditButton: {
    width: '100%',
    padding: SPACING.space_12,
    backgroundColor: COLORS.primaryDark,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
    borderRadius: 50,
  },
  EditButtonText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLight,
    textAlign: 'center',
  },
  CancelButton: {
    width: '48%',
    padding: SPACING.space_12,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
    borderRadius: 50,
  },
  CancelButtonText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryDark,
    textAlign: 'center',
  },
  UpdateButton: {
    width: '48%',
    padding: SPACING.space_12,
    backgroundColor: COLORS.primaryDark,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
    borderRadius: 50,
  },
  UpdateButtonText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLight,
    textAlign: 'center',
  },
  ErrorText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_16,
    color: COLORS.absent,
  },
});
