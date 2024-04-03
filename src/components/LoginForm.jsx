import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Formik} from 'formik';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../themes/Theme';
import {loginSchema} from './FormValidationSchemas/LoginFormValidationSchema';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {saveAuthDetails} from '../redux/auth';
// import {useNetInfo} from '@react-native-community/netinfo';

const LoginForm = props => {
  const {isLoginDone} = props;
  const [showLoader, setShowLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  // const {isConnected} = useNetInfo();

  const handleLogin = async values => {
    try {
      setShowLoader(true);
      setError(null);
      const {email, password} = values;
      const login = await auth().signInWithEmailAndPassword(email, password);
      if (login.user.emailVerified) {
        const isUserDetailsSet = await firestore()
          .collection('Users')
          .doc(login.user.uid)
          .get();

        if (!isUserDetailsSet._exists) {
          await firestore()
            .collection('Users')
            .doc(login.user.uid)
            .set({
              name: login.user.displayName,
              email: email,
              classes: [],
              notes: [],
            })
            .then(() => {
              isLoginDone(true);
            });
        } else {
          isLoginDone(true);
        }

        storeAuthDetailsLocally({
          name: login.user.displayName,
          email: email,
          uid: login.user.uid,
          password: password,
        });
        dispatch(saveAuthDetails(login.user.uid));
        setTimeout(() => {
          setShowLoader(false);
        }, 5000);
      } else {
        setError('Email Not Verified');
        setShowLoader(false);
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    } catch (err) {
      setShowLoader(false);
      setError(err.message);
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  const storeAuthDetailsLocally = async values => {
    try {
      const {name, email, uid, password} = values;
      await AsyncStorage.setItem('name', name);
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('uid', uid);
      await AsyncStorage.setItem('password', password);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Formik
        validationSchema={loginSchema}
        initialValues={{email: '', password: ''}}
        onSubmit={values => handleLogin(values)}>
        {({handleChange, handleBlur, handleSubmit, values, errors}) => (
          <ScrollView style={styles.LoginForm}>
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
            <View style={styles.FormField}>
              <View style={styles.FormFieldIonicons}>
                <Ionicons
                  name="lock-open-outline"
                  size={FONTSIZE.size_24}
                  color={COLORS.placeholder}></Ionicons>
              </View>
              <TextInput
                name="password"
                style={styles.InputField}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                numberOfLines={1}
                placeholder="Password"
                placeholderTextColor={COLORS.placeholder}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
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

            <TouchableOpacity
              disabled={
                errors.email ||
                errors.password ||
                values.email === '' ||
                values.password === ''
                  ? true
                  : false
              }
              onPress={() => {
                handleSubmit();
              }}
              activeOpacity={0.6}
              style={styles.LoginBtn}>
              {!showLoader && <Text style={styles.LoginText}>Login</Text>}
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
              {errors.password && (
                <Text style={styles.FormFieldError}>{errors.password}</Text>
              )}
            </View>
          </ScrollView>
        )}
      </Formik>
    </>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  LoginForm: {
    paddingLeft: SPACING.space_12,
    paddingRight: SPACING.space_12,
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
  LoginBtn: {
    width: '100%',
    backgroundColor: COLORS.primaryDark,
    padding: SPACING.space_10,
    marginTop: SPACING.space_28,
    borderRadius: 100,
  },
  LoginText: {
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
});
