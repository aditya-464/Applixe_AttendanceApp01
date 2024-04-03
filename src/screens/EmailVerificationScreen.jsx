import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../themes/Theme';

const EmailVerificationScreen = props => {
  const {navigation} = props;

  return (
    <SafeAreaView
      style={{
        height: '100%',
        backgroundColor: COLORS.primaryLight,
      }}>
      <View style={styles.EmailVerificationContainer}>
        <Text style={styles.EmailVerificationText}>Email Verification</Text>
      </View>
      <View style={styles.InstructionsInfo}>
        <Text style={styles.InstructionsInfoText}>
          Please verify your email by clicking on the link sent to you
        </Text>
      </View>
      <View style={styles.ButtonView}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Login');
          }}
          activeOpacity={0.6}
          style={styles.ProceedBtn}>
          <Text style={styles.ProceedText}>Okay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EmailVerificationScreen;

const styles = StyleSheet.create({
  EmailVerificationContainer: {
    paddingHorizontal: SPACING.space_12,
  },
  EmailVerificationText: {
    fontFamily: FONTFAMILY.poppins_bold,
    fontSize: FONTSIZE.size_28,
    marginVertical: SPACING.space_16,
    paddingHorizontal: SPACING.space_12,
    color: COLORS.primaryDark,
    opacity: 0.9,
  },
  InstructionsInfo: {
    paddingHorizontal: SPACING.space_24,
    marginTop: SPACING.space_16,
  },
  InstructionsInfoText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryDark,
  },
  ButtonView: {
    paddingHorizontal: SPACING.space_24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  ProceedBtn: {
    width: '50%',
    paddingHorizontal: SPACING.space_24,
    backgroundColor: COLORS.primaryDark,
    padding: SPACING.space_10,
    marginTop: SPACING.space_28,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
  },
  ProceedText: {
    color: COLORS.primaryLight,
    textAlign: 'center',
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_16,
  },
});
