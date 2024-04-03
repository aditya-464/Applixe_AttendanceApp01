import {
  ActivityIndicator,
  Keyboard,
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
import firestore from '@react-native-firebase/firestore';

const ViewRecordModal = props => {
  const {
    handleCloseViewRecordModal,
    viewRecordModalView,
    id,
    handleMoveToViewRecordScreen,
  } = props;
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState(null);
  const [showLoader, setShowLoader] = useState(false);

  const clearDateValues = () => {
    setDate('');
    setMonth('');
    setYear('');
    setError(null);
  };

  const getDateAsKeyValidity = dateAsKey => {
    if (dateAsKey.length !== 10) {
      setError('Enter Date In Valid Format');
      setShowLoader(false);
      return false;
    } else {
      if (date > 31 || date < 1 || month > 12 || month < 1) {
        setError('Enter Valid Date');
        setShowLoader(false);
        return false;
      }
    }
    return true;
  };

  const handleViewRecord = async () => {
    try {
      setShowLoader(true);
      const dateAsKey = '' + date + '-' + month + '-' + year;
      const isDateAsKeyValid = getDateAsKeyValidity(dateAsKey);

      if (isDateAsKeyValid) {
        const attendanceRecords = await firestore()
          .collection('Attendance')
          .doc(id)
          .get();

        const topicRecord = await firestore()
          .collection('Topics')
          .doc(id)
          .get();

        if (attendanceRecords.exists && topicRecord.exists) {
          const attendanceBinaryArray = attendanceRecords.data()[dateAsKey];
          const topic = topicRecord.data()[dateAsKey];
          if (attendanceBinaryArray && topic) {
            handleCloseViewRecordModal(false);
            handleMoveToViewRecordScreen({
              dateAsKey,
              attendanceBinaryArray,
              topic,
            });
            clearDateValues();
            setError(null);

            setTimeout(() => {
              setShowLoader(false);
            }, 2000);
          } else {
            setError('No Data Available');
            setShowLoader(false);
          }
        }
      }
    } catch (error) {
      console.log(error);
      setShowLoader(false);
    }
  };

  return (
    <SafeAreaView>
      <Modal
        useNativeDriver={true}
        isVisible={viewRecordModalView}
        animationIn={'fadeInUp'}
        animationOut={'fadeOutDown'}>
        <View
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}>
          <View style={styles.ViewRecordModal}>
            <View style={styles.CloseModal}>
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.CloseModalButton}
                onPress={() => {
                  handleCloseViewRecordModal(false);
                  clearDateValues();
                  Keyboard.dismiss();
                }}>
                <Ionicons
                  name="close"
                  size={FONTSIZE.size_30}
                  color={COLORS.primaryDark}></Ionicons>
              </TouchableOpacity>
            </View>
            <Text style={styles.AddStudentTitle}>View Record</Text>
            <View style={styles.DateInputFields}>
              <TextInput
                style={styles.InputField}
                placeholder="DD"
                placeholderTextColor={COLORS.placeholder}
                maxLength={2}
                value={date}
                onChangeText={text => setDate(text)}
                keyboardType="numeric"></TextInput>
              <Text
                style={{
                  marginHorizontal: SPACING.space_8,
                  color: COLORS.placeholder,
                }}>
                -
              </Text>
              <TextInput
                style={styles.InputField}
                placeholder="MM"
                placeholderTextColor={COLORS.placeholder}
                maxLength={2}
                value={month}
                onChangeText={text => setMonth(text)}
                keyboardType="numeric"></TextInput>
              <Text
                style={{
                  marginHorizontal: SPACING.space_8,
                  color: COLORS.placeholder,
                }}>
                -
              </Text>
              <TextInput
                style={styles.InputField}
                placeholder="YYYY"
                placeholderTextColor={COLORS.placeholder}
                maxLength={4}
                value={year}
                onChangeText={text => setYear(text)}
                keyboardType="numeric"></TextInput>
            </View>
            <View style={styles.ButtonView}>
              <TouchableOpacity
                disabled={
                  date === '' || month === '' || year === '' ? true : false
                }
                onPress={() => {
                  handleViewRecord();
                  Keyboard.dismiss();
                }}
                activeOpacity={0.6}
                style={styles.ViewRecordButton}>
                {!showLoader && <Text style={styles.ViewRecordText}>View</Text>}
                {showLoader && (
                  <ActivityIndicator
                    animating={showLoader}
                    size={26}
                    color={COLORS.primaryLight}
                  />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.ErrorText}>{error}</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ViewRecordModal;

const styles = StyleSheet.create({
  ViewRecordModal: {
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
  AddStudentTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_28,
    color: COLORS.primaryDark,
  },
  DateInputFields: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  InputField: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_16,
    marginTop: SPACING.space_4,
    borderBottomWidth: 0.2,
    borderColor: '#cccccc',
    color: COLORS.primaryDark,
    minWidth: 40,
    textAlign: 'center',
  },
  ButtonView: {
    marginTop: SPACING.space_20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  ViewRecordButton: {
    width: '48%',
    backgroundColor: COLORS.primaryDark,
    padding: SPACING.space_12,
    borderRadius: 50,
  },
  ViewRecordText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLight,
    textAlign: 'center',
  },
  ErrorText: {
    marginTop: SPACING.space_10,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.absent,
  },
});
