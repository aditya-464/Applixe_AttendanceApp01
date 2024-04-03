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
import React, {useState} from 'react';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../themes/Theme';
import {Formik} from 'formik';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {forgetPasswordSchema} from '../components/FormValidationSchemas/ForgetPasswordValidationSchema';
import auth from '@react-native-firebase/auth';
// import {useNetInfo} from '@react-native-community/netinfo';

const ForgotPasswordScreen = props => {
  const {navigation} = props;
  const [showLoader, setShowLoader] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  // const {isConnected} = useNetInfo();

  const handleForgotPassword = async values => {
    try {
      const {email} = values;
      await auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          setError(null);
          setSuccess('Reset Password Email Sent');
          setShowLoader(false);
          setError(null);
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
    <SafeAreaView
      style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: COLORS.primaryLight,
      }}>
      <View style={styles.ForgotPasswordScreenContainer}>
        <Text style={styles.ForgotPasswordScreenText}>Forgot Password?</Text>
        <View style={styles.ForgotPasswordScreenContent}>
          <Formik
            validationSchema={forgetPasswordSchema}
            initialValues={{email: ''}}
            onSubmit={values => handleForgotPassword(values)}>
            {({handleChange, handleBlur, handleSubmit, values, errors}) => (
              <ScrollView style={styles.ForgotPasswordForm}>
                <View style={styles.FormField}>
                  <View style={styles.FormFieldIonicons}>
                    <Fontisto
                      name="email"
                      size={FONTSIZE.size_24}
                      color={COLORS.placeholder}></Fontisto>
                  </View>
                  <TextInput
                    name="email"
                    style={styles.InputField}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    keyboardType="email-address"
                    numberOfLines={1}
                    placeholder="Email"
                    placeholderTextColor={COLORS.placeholder}
                    autoCapitalize="none"
                  />
                </View>

                <TouchableOpacity
                  disabled={errors.email || values.email === '' ? true : false}
                  onPress={() => {
                    handleSubmit();
                    setShowLoader(true);
                    setError(null);
                    setSuccess(null);
                  }}
                  activeOpacity={0.6}
                  style={styles.ForgotPasswordBtn}>
                  {!showLoader && (
                    <Text style={styles.ForgotPasswordText}>Send</Text>
                  )}
                  {showLoader && (
                    <ActivityIndicator
                      animating={showLoader}
                      size={26}
                      color={COLORS.primaryLight}
                    />
                  )}
                </TouchableOpacity>

                <View style={{marginTop: SPACING.space_15}}>
                  {error && <Text style={styles.FormFieldError}>{error}</Text>}
                  {errors.email && (
                    <Text style={styles.FormFieldError}>{errors.email}</Text>
                  )}
                  {success && <Text style={styles.SuccessText}>{success}</Text>}
                </View>
              </ScrollView>
            )}
          </Formik>
        </View>
      </View>

      <View style={styles.GoBackToLogin}>
        <TouchableOpacity disabled={true}>
          <Text style={styles.GoBackText}>Go Back To</Text>
        </TouchableOpacity>
        <Text> </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.LoginText}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  ForgotPasswordScreenContainer: {
    paddingHorizontal: SPACING.space_12,
  },
  ForgotPasswordScreenText: {
    fontFamily: FONTFAMILY.poppins_bold,
    fontSize: FONTSIZE.size_28,
    marginVertical: SPACING.space_16,
    paddingHorizontal: SPACING.space_12,
    color: COLORS.primaryDark,
    opacity: 0.9,
  },
  ForgotPasswordForm: {
    paddingHorizontal: SPACING.space_12,
    backgroundColor: COLORS.primaryLight,
  },
  FormField: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.space_2,
    paddingBottom: SPACING.space_2,
  },
  FormFieldIonicons: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: SPACING.space_12,
  },
  InputField: {
    flex: 1,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    display: 'flex',
    justifyContent: 'center',
    marginTop: SPACING.space_4,
    borderBottomWidth: 0.2,
    borderColor: '#cccccc',
    color: COLORS.primaryDark,
  },
  PasswordIconButton: {
    paddingHorizontal: SPACING.space_12,
  },
  ForgotPasswordBtn: {
    width: '100%',
    backgroundColor: COLORS.primaryDark,
    padding: SPACING.space_10,
    marginTop: SPACING.space_28,
    borderRadius: 100,
  },
  ForgotPasswordText: {
    color: COLORS.primaryLight,
    textAlign: 'center',
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_16,
  },
  FormFieldError: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_12,
    color: COLORS.absent,
  },
  SuccessText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_12,
    color: COLORS.present,
  },
  GoBackToLogin: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: SPACING.space_20,
  },
  GoBackText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryDark,
  },
  LoginText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.secondaryDark,
    marginHorizontal: SPACING.space_4,
  },
});
