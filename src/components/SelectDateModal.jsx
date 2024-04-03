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
import React, {useEffect, useState} from 'react';
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
import {useDispatch, useSelector} from 'react-redux';
import {refreshTotalAttendanceFunc} from '../redux/refreshTotalAttendance';

const SelectDateModal = props => {
  const {handleCloseSelectDateModal, selectDateModalView, studentsData, id} =
    props;
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [topic, setTopic] = useState('');
  const [attendanceBinaryArray, setAttendanceBinaryArray] = useState([]);
  const [previousTotalAttendance, setPreviousTotalAttendance] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const {refreshTotalAttendanceValue} = useSelector(
    state => state.refreshTotalAttendanceDetails,
  );
  const dispatch = useDispatch();

  const getNewTotalAttendance = subtractData => {
    const tempArray = [];
    if (subtractData == null) {
      for (let i = 0; i < previousTotalAttendance.length; i++) {
        tempArray.push(previousTotalAttendance[i] + attendanceBinaryArray[i]);
      }
    } else {
      for (let i = 0; i < previousTotalAttendance.length; i++) {
        tempArray.push(
          previousTotalAttendance[i] -
            subtractData[i] +
            attendanceBinaryArray[i],
        );
      }
    }
    return tempArray;
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

  const clearDateValues = () => {
    setDate('');
    setMonth('');
    setYear('');
    setTopic('');
    setError(null);
    setSuccess(null);
  };

  const submitAttendance = async () => {
    try {
      const dateAsKey = '' + date + '-' + month + '-' + year;
      const isDateAsKeyValid = getDateAsKeyValidity(dateAsKey);

      if (isDateAsKeyValid && topic !== '') {
        if (previousTotalAttendance.length === 0) {
          // Update total attendance
          await firestore()
            .collection('Classes')
            .doc(id)
            .set(
              {
                totalAttendance: attendanceBinaryArray,
              },
              {merge: true},
            )
            .then(() => {
              dispatch(refreshTotalAttendanceFunc());
            });

          // Marking current attendance
          await firestore()
            .collection('Attendance')
            .doc(id)
            .set(
              {
                [dateAsKey]: attendanceBinaryArray,
              },
              {merge: true},
            )
            .then(async () => {
              await firestore()
                .collection('Topics')
                .doc(id)
                .set(
                  {
                    [dateAsKey]: topic,
                  },
                  {merge: true},
                )
                .then(() => {
                  setShowLoader(false);
                  setError(null);
                  setSuccess('Attendance Marked');
                  setTimeout(() => {
                    handleCloseSelectDateModal(false);
                    clearDateValues();
                  }, 1500);
                });
            });
        } else {
          const attendanceDetails = await firestore()
            .collection('Attendance')
            .doc(id)
            .get();

          if (attendanceDetails) {
            if (attendanceDetails._data[dateAsKey]) {
              const newTotalAttendanceArray = getNewTotalAttendance(
                attendanceDetails._data[dateAsKey],
              );

              // Update total attendance
              await firestore()
                .collection('Classes')
                .doc(id)
                .set(
                  {
                    totalAttendance: newTotalAttendanceArray,
                  },
                  {merge: true},
                )
                .then(() => {
                  dispatch(refreshTotalAttendanceFunc());
                });

              // Marking current attendance
              await firestore()
                .collection('Attendance')
                .doc(id)
                .set(
                  {
                    [dateAsKey]: attendanceBinaryArray,
                  },
                  {merge: true},
                )
                .then(async () => {
                  await firestore()
                    .collection('Topics')
                    .doc(id)
                    .set(
                      {
                        [dateAsKey]: topic,
                      },
                      {merge: true},
                    )
                    .then(() => {
                      setShowLoader(false);
                      setError(null);
                      setSuccess('Attendance Marked');
                      setTimeout(() => {
                        handleCloseSelectDateModal(false);
                        clearDateValues();
                      }, 1500);
                    });
                });
            } else {
              const newTotalAttendanceArray = getNewTotalAttendance(null);

              // Update total attendance
              await firestore()
                .collection('Classes')
                .doc(id)
                .set(
                  {
                    totalAttendance: newTotalAttendanceArray,
                  },
                  {merge: true},
                )
                .then(() => {
                  dispatch(refreshTotalAttendanceFunc());
                });

              // Marking current attendance
              await firestore()
                .collection('Attendance')
                .doc(id)
                .set(
                  {
                    [dateAsKey]: attendanceBinaryArray,
                  },
                  {merge: true},
                )
                .then(async () => {
                  await firestore()
                    .collection('Topics')
                    .doc(id)
                    .set(
                      {
                        [dateAsKey]: topic,
                      },
                      {merge: true},
                    )
                    .then(() => {
                      setShowLoader(false);
                      setSuccess('Attendance Marked');
                      setTimeout(() => {
                        handleCloseSelectDateModal(false);
                        clearDateValues();
                      }, 1500);
                    });
                });
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAttendanceBinaryArray = studentsData => {
    const tempArray = [];
    for (let i = 0; i < studentsData.length; i++) {
      if (studentsData[i].present) {
        tempArray.push(1);
      } else {
        tempArray.push(0);
      }
    }
    setAttendanceBinaryArray(tempArray);
  };

  const getPreviousTotalAttendance = async () => {
    try {
      const classDetails = await firestore()
        .collection('Classes')
        .doc(id)
        .get();
      if (classDetails.exists) {
        setPreviousTotalAttendance(classDetails.data().totalAttendance);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPreviousTotalAttendance();
    getAttendanceBinaryArray(studentsData);
  }, [studentsData, refreshTotalAttendanceValue]);

  return (
    <SafeAreaView>
      <Modal
        useNativeDriver={true}
        isVisible={selectDateModalView}
        animationIn={'fadeInUp'}
        animationOut={'fadeOutDown'}>
        <View
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}>
          <View style={styles.SelectDateModal}>
            <View style={styles.CloseModal}>
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.CloseModalButton}
                onPress={() => {
                  setShowLoader(false);
                  setError(null);
                  setSuccess(null);
                  handleCloseSelectDateModal(false);
                  clearDateValues();
                  Keyboard.dismiss();
                }}>
                <Ionicons
                  name="close"
                  size={FONTSIZE.size_30}
                  color={COLORS.primaryDark}></Ionicons>
              </TouchableOpacity>
            </View>
            <Text style={styles.SelectDateTitle}>Date & Topic</Text>
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
            <View style={styles.TopicInputField}>
              <TextInput
                style={styles.InputField}
                placeholder="Topic"
                placeholderTextColor={COLORS.placeholder}
                numberOfLines={1}
                value={topic}
                onChangeText={text => setTopic(text)}
                textAlign="left"></TextInput>
            </View>
            <View style={styles.ButtonView}>
              <TouchableOpacity
                disabled={
                  date === '' || month === '' || year === '' || topic === ''
                    ? true
                    : false
                }
                onPress={() => {
                  setError(null);
                  setShowLoader(true);
                  submitAttendance();
                  Keyboard.dismiss();
                }}
                activeOpacity={0.6}
                style={styles.SelectDateButton}>
                {!showLoader && (
                  <Text style={styles.SelectDateText}>Submit</Text>
                )}
                {showLoader && (
                  <ActivityIndicator
                    size={26}
                    color={COLORS.primaryLight}
                    animating={showLoader}
                  />
                )}
              </TouchableOpacity>
            </View>
            {error === null && success === null && (
              <Text style={styles.DummyText}>-</Text>
            )}
            {error && <Text style={styles.ErrorText}>{error}</Text>}
            {success && <Text style={styles.SuccessText}>{success}</Text>}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SelectDateModal;

const styles = StyleSheet.create({
  SelectDateModal: {
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
  SelectDateTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_28,
    color: COLORS.primaryDark,
  },
  SelectDateTextInfo: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryDark,
    marginVertical: SPACING.space_12,
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
  TopicInputField: {
    marginTop: SPACING.space_4,
  },
  ButtonView: {
    marginTop: SPACING.space_20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  SelectDateButton: {
    width: '48%',
    backgroundColor: COLORS.primaryDark,
    padding: SPACING.space_12,
    borderRadius: 50,
  },
  SelectDateText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLight,
    textAlign: 'center',
  },
  DummyText: {
    marginTop: SPACING.space_10,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryLight,
  },
  ErrorText: {
    marginTop: SPACING.space_10,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.absent,
  },
  SuccessText: {
    marginTop: SPACING.space_10,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.present,
  },
});
