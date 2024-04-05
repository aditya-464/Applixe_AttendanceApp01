import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  ActivityIndicator,
  TextInput,
  Keyboard,
} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../themes/Theme';
import {writeFile} from 'react-native-fs';
import XLSX, {stream} from 'xlsx';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GenerateReportModal = props => {
  const {
    handleCloseGenerateReportModal,
    generateReportModalView,
    id,
    subject,
    initials,
    branch,
    semester,
    section,
    refreshValue,
  } = props;
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [date2, setDate2] = useState('');
  const [month2, setMonth2] = useState('');
  const [year2, setYear2] = useState('');
  const [error, setError] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [success, setSuccess] = useState(null);
  const [showDateInputs, setShowDateInputs] = useState(false);
  const [classDetails, setClassDetails] = useState(null);
  const [attendanceDetails, setAttendanceDetails] = useState(null);
  const [blank, setBlank] = useState('');

  const handleClearInputs = () => {
    setDate('');
    setMonth('');
    setYear('');
    setDate2('');
    setMonth2('');
    setYear2('');
  };

  const getFileInfoData = async () => {
    const userName = await AsyncStorage.getItem('name');
    let temp = {};
    if (userName) {
      temp = {
        Subject: '',
        [subject]: '',
        [blank]: '',
        Stream: '',
        [stream]: '',
        [blank]: '',
        Semester: '',
        [semester]: '',
        [blank]: '',
        Section: '',
        [section]: '',
        [blank]: '',
        Teacher: '',
        [userName]: '',
      };
    }

    return temp;
  };

  // const newFuncConvert = async () => {
  //   try {
  //     let temp = await getFileInfoData();
  //     if (temp) {
  //       const existingWorkbook = XLSX.readFile(
  //         `/storage/emulated/0/Download/${filename}.xlsx`,
  //       ); // Path to the existing Excel file

  //       const existingWorksheet =
  //         existingWorkbook.Sheets[existingWorkbook.SheetNames[0]]; // Assuming there's only one sheet
  //       const existingData = XLSX.utils.sheet_to_json(existingWorksheet);

  //       const combinedData = [temp, ...existingData]; // Combine data with temp object at the top

  //       // Generate new workbook
  //       var ws = XLSX.utils.json_to_sheet(combinedData);
  //       var wb = XLSX.utils.book_new();
  //       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //       const wbout = XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});

  //       // Write new workbook to file
  //       var filename = initials + '-' + branch + '-' + semester + '-' + section;
  //       var newFilePath = `/storage/emulated/0/Download/${filename}.xlsx`;
  //       await writeFile(newFilePath, wbout, 'ascii')
  //         .then(() => {
  //           setShowLoader(false);
  //           setError(null);
  //           setSuccess('Report Downloaded');
  //           setTimeout(() => {
  //             handleClearInputs();
  //             setSuccess(null);
  //             handleCloseGenerateReportModal(false);
  //             setShowDateInputs(false);
  //           }, 500);
  //         })
  //         .catch(error => {
  //           setError(error.message);
  //           setSuccess(null);
  //           setShowDateInputs(false);
  //         });
  //     }
  //   } catch (error) {
  //     setError(error.message);
  //     setShowDateInputs(false);
  //   }
  // };

  const getClassDetails = async id => {
    try {
      if (classDetails !== null && attendanceDetails !== null) {
        let tempArray = [];
        const totalDays = Object.keys(attendanceDetails).length;
        const studentDetails = classDetails.studentDetails;
        const totalAttendance = classDetails.totalAttendance;
        for (let i = 0; i < studentDetails.length; i++) {
          const percentage = Math.ceil((totalAttendance[i] / totalDays) * 100);
          tempArray.push({
            Class_Roll: studentDetails[i].roll.toString(),
            University_Roll: studentDetails[i].uniRoll.toString(),
            Name: studentDetails[i].name,
            Total: totalDays.toString(),
            Present: totalAttendance[i].toString(),
            Percentage: percentage.toString(),
          });
        }
        return tempArray;
      }
    } catch (error) {
      setError(error.message);
      setShowLoader(false);
      setSuccess(null);
    }
  };

  const handleGenerateReport = async () => {
    try {
      const jsonData = await getClassDetails(id);
      // const fileInfoData = await getFileInfoData();
      if (jsonData) {
        // const granted = await PermissionsAndroid.request();

        let deviceVersion = DeviceInfo.getSystemVersion();
        let granted = PermissionsAndroid.RESULTS.DENIED;
        if (deviceVersion >= 13) {
          granted = PermissionsAndroid.RESULTS.GRANTED;
        } else {
          granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          );
        }

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          var ws = XLSX.utils.json_to_sheet(jsonData);
          var wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          const wbout = XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});
          var filename =
            initials + '-' + branch + '-' + semester + '-' + section;
          var file = `/storage/emulated/0/Download/${filename}.xlsx`;
          await writeFile(file, wbout, 'ascii')
            .then(() => {
              setShowLoader(false);
              setError(null);
              setSuccess('Report Downloaded');
              setTimeout(() => {
                handleClearInputs();
                setSuccess(null);
                handleCloseGenerateReportModal(false);
                setShowDateInputs(false);
              }, 500);
            })
            .catch(error => {
              setError(error.message);
              setSuccess(null);
              setShowDateInputs(false);
            });
        } else {
          setError('Write external storage permission denied');
        }
      }
    } catch (error) {
      setError(error.message);
      setShowDateInputs(false);
    }
  };

  const isInRange = (fromDateKey, toDateKey, key) => {
    let from = new Date(fromDateKey);
    let to = new Date(toDateKey);
    let check = new Date(key);

    return check >= from && check <= to;
  };

  const getCustomClassDetails = async (fromDateKey, toDateKey) => {
    try {
      if (classDetails !== null && attendanceDetails !== null) {
        let tempAttendance = [];
        const studentDetails = classDetails.studentDetails;
        for (let i = 0; i < studentDetails.length; i++) {
          tempAttendance.push(0);
        }

        // Check for data in provided range
        let totalDays = 0;
        const attendanceDetailsData = attendanceDetails;
        for (let key in attendanceDetailsData) {
          if (attendanceDetailsData.hasOwnProperty(key)) {
            if (isInRange(fromDateKey, toDateKey, key)) {
              ++totalDays;
              for (let i = 0; i < studentDetails.length; i++) {
                tempAttendance[i] += attendanceDetailsData[key][i];
              }
            }
          }
        }

        // Create final json data array
        let tempArray = [];
        for (let i = 0; i < studentDetails.length; i++) {
          const percentage = Math.ceil((tempAttendance[i] / totalDays) * 100);
          tempArray.push({
            Class_Roll: studentDetails[i].roll.toString(),
            University_Roll: studentDetails[i].uniRoll.toString(),
            Name: studentDetails[i].name,
            Total: totalDays.toString(),
            Present: tempAttendance[i].toString(),
            Percentage: percentage.toString(),
          });
        }
        return tempArray;
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getDateAsKeyValidity = (fromDateKey, toDateKey) => {
    if (fromDateKey.length !== 10 || toDateKey.length !== 10) {
      setError('Enter Date In Valid Format');
      setShowLoader(false);
      return false;
    } else {
      if (
        date > 31 ||
        date < 1 ||
        month > 12 ||
        month < 1 ||
        date2 > 31 ||
        date2 < 1 ||
        month2 > 12 ||
        month2 < 1 ||
        year <= 0 ||
        year2 <= 0
      ) {
        setError('Enter Valid Date');
        setShowLoader(false);
        return false;
      }
    }
    return true;
  };

  const handleGenerateCustomReport = async () => {
    try {
      const fromDateKey = '' + year + '-' + month + '-' + date;
      const toDateKey = '' + year2 + '-' + month2 + '-' + date2;
      const areDateKeysValid = getDateAsKeyValidity(fromDateKey, toDateKey);

      if (areDateKeysValid) {
        Keyboard.dismiss();
        const jsonData = await getCustomClassDetails(fromDateKey, toDateKey);
        if (jsonData) {
          // const granted = await PermissionsAndroid.request();

          let deviceVersion = DeviceInfo.getSystemVersion();
          let granted = PermissionsAndroid.RESULTS.DENIED;
          if (deviceVersion >= 13) {
            granted = PermissionsAndroid.RESULTS.GRANTED;
          } else {
            granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            );
          }

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            var ws = XLSX.utils.json_to_sheet(jsonData);
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            const wbout = XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});
            var filename =
              initials + '-' + branch + '-' + semester + '-' + section;
            var file = `/storage/emulated/0/Download/${filename}.xlsx`;
            await writeFile(file, wbout, 'ascii')
              .then(() => {
                setShowLoader(false);
                setError(null);
                setSuccess('Report Downloaded');
                setTimeout(() => {
                  handleClearInputs();
                  setSuccess(null);
                  handleCloseGenerateReportModal(false);
                  setShowDateInputs(false);
                }, 500);
              })
              .catch(error => {
                setError(error.message);
                setSuccess(null);
                setShowDateInputs(false);
              });
          } else {
            setError('Write external storage permission denied');
          }
        }
      }
    } catch (error) {
      console.log(error.message);
      setShowDateInputs(false);
    }
  };

  const getData = async () => {
    try {
      const res1 = await firestore().collection('Classes').doc(id).get();

      const res2 = await firestore().collection('Attendance').doc(id).get();

      if (res1.exists) {
        setClassDetails(res1.data());
      }
      if (res2.exists) {
        setAttendanceDetails(res2.data());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, [refreshValue]);

  return (
    <SafeAreaView>
      <Modal
        useNativeDriver={true}
        isVisible={generateReportModalView}
        animationIn={'fadeInUp'}
        animationOut={'fadeOutDown'}>
        <View
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}>
          <View style={styles.GenerateReportModal}>
            <View style={styles.CloseModal}>
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.CloseModalButton}
                onPress={() => {
                  handleCloseGenerateReportModal(false);
                  setShowDateInputs(false);
                  setShowLoader(null);
                  setError(null);
                  setSuccess(null);
                  handleClearInputs();
                }}>
                <Ionicons
                  name="close"
                  size={FONTSIZE.size_30}
                  color={COLORS.primaryDark}></Ionicons>
              </TouchableOpacity>
            </View>
            <Text style={styles.GenerateReportTitle}>Generate Report</Text>
            {!showDateInputs && (
              <Text style={styles.GenerateReportTextInfo}>
                Attendance report of this class will be downloaded shortly
              </Text>
            )}

            {showDateInputs && (
              <>
                <View style={{marginTop: SPACING.space_15}}>
                  <View style={styles.DateInputsRow}>
                    <Text style={styles.DateLabel}>From :</Text>
                    <View style={styles.DateInputFields}>
                      <TextInput
                        style={styles.InputField}
                        placeholder="DD"
                        placeholderTextColor={COLORS.placeholder}
                        maxLength={2}
                        value={date}
                        onChangeText={val => setDate(val)}
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
                  </View>
                </View>

                <View>
                  <View style={styles.DateInputsRow}>
                    <Text style={styles.DateLabel}>To :</Text>
                    <View style={styles.DateInputFields}>
                      <TextInput
                        style={styles.InputField}
                        placeholder="DD"
                        placeholderTextColor={COLORS.placeholder}
                        maxLength={2}
                        value={date2}
                        onChangeText={text => setDate2(text)}
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
                        value={month2}
                        onChangeText={text => setMonth2(text)}
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
                        value={year2}
                        onChangeText={text => setYear2(text)}
                        keyboardType="numeric"></TextInput>
                    </View>
                  </View>
                </View>
              </>
            )}

            <View
              style={[
                styles.ButtonView,
                {justifyContent: showDateInputs ? 'flex-end' : 'space-between'},
              ]}>
              {!showDateInputs && (
                <TouchableOpacity
                  onPress={() => {
                    setShowLoader(true);
                    handleGenerateReport();
                  }}
                  activeOpacity={0.6}
                  style={[
                    styles.GenerateReportButton,
                    {
                      backgroundColor: COLORS.primaryLight,
                    },
                  ]}>
                  {!showLoader && (
                    <Text
                      style={[
                        styles.GenerateReportText,
                        {color: COLORS.primaryDark},
                      ]}>
                      Entire
                    </Text>
                  )}
                  {showLoader && (
                    <ActivityIndicator
                      size={26}
                      color={COLORS.primaryDark}
                      animating={showLoader}
                    />
                  )}
                </TouchableOpacity>
              )}

              {!showDateInputs && (
                <TouchableOpacity
                  onPress={() => {
                    setShowDateInputs(prev => !prev);
                  }}
                  activeOpacity={0.6}
                  style={styles.GenerateReportButton}>
                  <Text style={styles.GenerateReportText}>Custom</Text>
                </TouchableOpacity>
              )}

              {showDateInputs && (
                <TouchableOpacity
                  onPress={() => {
                    setShowLoader(true);
                    handleGenerateCustomReport();
                  }}
                  activeOpacity={0.6}
                  style={styles.GenerateReportButton}>
                  {!showLoader && (
                    <Text style={styles.GenerateReportText}>Okay</Text>
                  )}
                  {showLoader && (
                    <ActivityIndicator
                      size={26}
                      color={COLORS.primaryLight}
                      animating={showLoader}
                    />
                  )}
                </TouchableOpacity>
              )}
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

export default memo(GenerateReportModal);

const styles = StyleSheet.create({
  GenerateReportModal: {
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
  GenerateReportTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_28,
    color: COLORS.primaryDark,
  },
  GenerateReportTextInfo: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryDark,
    marginVertical: SPACING.space_12,
  },
  DateInputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  DateLabel: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryDark,
    width: '20%',
  },
  DateInputFields: {
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  GenerateReportButton: {
    width: '48%',
    backgroundColor: COLORS.primaryDark,
    padding: SPACING.space_12,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
  },
  GenerateReportText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLight,
    textAlign: 'center',
  },
  DummyText: {
    marginTop: SPACING.space_15,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryLight,
  },
  ErrorText: {
    marginTop: SPACING.space_15,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.absent,
  },
  SuccessText: {
    marginTop: SPACING.space_15,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.present,
  },
});
