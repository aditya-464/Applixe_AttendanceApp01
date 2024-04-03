import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../themes/Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';

const RemoveStudentModal = props => {
  const [studentName, setStudentName] = useState(null);
  const [studentRoll, setStudentRoll] = useState(null);
  const {removeStudentModalView, handleCloseRemoveStudentModal} = props;

  return (
    <SafeAreaView>
      <Modal useNativeDriver={true} isVisible={removeStudentModalView}>
        <View
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}>
          <View style={styles.RemoveStudentModal}>
            <View style={styles.CloseModal}>
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.CloseModalButton}
                onPress={() => handleCloseRemoveStudentModal(false)}>
                <Ionicons
                  name="close"
                  size={FONTSIZE.size_30}
                  color={COLORS.primaryDark}></Ionicons>
              </TouchableOpacity>
            </View>
            <Text style={styles.RemoveStudentTitle}>Remove Student</Text>
            <TextInput
              style={styles.InputField}
              placeholder="Name"
              value={studentName}
              onChangeText={text => setStudentName(text)}></TextInput>
            <TextInput
              style={styles.InputField}
              placeholder="Roll"
              value={studentRoll}
              onChangeText={text => setStudentRoll(text)}></TextInput>
            <View style={styles.ButtonView}>
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.RemoveStudentButton}>
                <Text style={styles.RemoveStudentButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default RemoveStudentModal;

const styles = StyleSheet.create({
  RemoveStudentModal: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDERRADIUS.radius_10,
    padding: SPACING.space_16,
  },
  CloseModal: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  CloseModalButton: {},
  RemoveStudentTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_28,
    color: COLORS.primaryDark,
  },
  InputField: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_16,
    marginTop: SPACING.space_4,
    borderBottomWidth: 0.2,
    borderColor: '#cccccc',
    color: COLORS.primaryDark,
  },
  ButtonView: {
    marginTop: SPACING.space_20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  RemoveStudentButton: {
    width: '48%',
    backgroundColor: COLORS.primaryDark,
    padding: SPACING.space_12,
    borderRadius: 50,
  },
  RemoveStudentButtonText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLight,
    textAlign: 'center',
  },
});
