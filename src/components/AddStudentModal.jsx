import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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

const AddStudentModal = props => {
  const {addStudentModalView, handleCloseAddStudentModal} = props;
  const [studentName, setStudentName] = useState(null);
  const [studentRoll, setStudentRoll] = useState(null);

  return (
    <SafeAreaView>
      <Modal useNativeDriver={true} isVisible={addStudentModalView}>
        <View
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}>
          <View style={styles.AddStudentModal}>
            <View style={styles.CloseModal}>
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.CloseModalButton}
                onPress={() => handleCloseAddStudentModal(false)}>
                <Ionicons
                  name="close"
                  size={FONTSIZE.size_30}
                  color={COLORS.primaryDark}></Ionicons>
              </TouchableOpacity>
            </View>
            <Text style={styles.AddStudentTitle}>Add Student</Text>
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
                style={styles.AddStudentButton}>
                <Text style={styles.AddStudentText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AddStudentModal;

const styles = StyleSheet.create({
  AddStudentModal: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDERRADIUS.radius_10,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 3},
    // shadowOpacity: 0.5,
    // shadowRadius: 3,
    // elevation: Platform.OS === 'android' ? 5 : 0,
    padding: SPACING.space_16,
  },
  CloseModal: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  CloseModalButton: {},
  AddStudentTitle: {
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
  AddStudentButton: {
    width: '48%',
    backgroundColor: COLORS.primaryDark,
    padding: SPACING.space_12,
    borderRadius: 50,
  },
  AddStudentText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLight,
    textAlign: 'center',
  },
});
