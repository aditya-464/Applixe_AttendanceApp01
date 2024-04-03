import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../themes/Theme';
import LoginForm from '../components/LoginForm';

const LoginScreen = props => {
  const {navigation} = props;
  const isLoginDone = value => {
    if (value) {
      navigation.reset({
        index: 0,
        routes: [{name: 'DrawerNavigator'}],
      });
    }
  };

  return (
    <SafeAreaView
      style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: COLORS.primaryLight,
      }}>
      <View style={styles.LoginContainer}>
        <Text style={styles.LoginText}>Hello User!</Text>
        <LoginForm isLoginDone={isLoginDone}></LoginForm>
      </View>

      <View style={styles.OtherOptions}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ForgotPasswordScreen');
          }}
          activeOpacity={0.6}
          style={styles.ForgotPasswordButton}>
          <Text style={styles.ForgotPasswordButtonText}>Forgot Password?</Text>
        </TouchableOpacity>
        <View style={styles.SignupOption}>
          <TouchableOpacity disabled={true}>
            <Text style={styles.SignupText}>Don't have an Account? </Text>
          </TouchableOpacity>
          <Text> </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.Signup}>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  LoginContainer: {
    paddingHorizontal: SPACING.space_12,
  },
  LoginText: {
    fontFamily: FONTFAMILY.poppins_bold,
    fontSize: FONTSIZE.size_28,
    marginVertical: SPACING.space_16,
    paddingHorizontal: SPACING.space_12,
    color: COLORS.primaryDark,
    opacity: 0.9,
  },
  OtherOptions: {
    paddingBottom: SPACING.space_20,
  },
  ForgotPasswordButton: {
    alignSelf: 'center',
    marginBottom: SPACING.space_12,
  },
  ForgotPasswordButtonText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.secondaryDark,
  },
  SignupOption: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  SignupText: {
    textAlign: 'center',
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryDark,
  },
  Signup: {
    textAlign: 'center',
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.secondaryDark,
    marginHorizontal: SPACING.space_2,
  },
});
