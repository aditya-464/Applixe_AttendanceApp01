import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../themes/Theme';
import {writeFile} from 'react-native-fs';
import XLSX from 'xlsx';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';
// import {useNetInfo} from '@react-native-community/netinfo';

const GenerateReportModal = props => {
  const {
    handleCloseGenerateReportModal,
    generateReportModalView,
    id,
    initials,
    branch,
    semester,
    section,
  } = props;
  const [error, setError] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [success, setSuccess] = useState(null);
  // const {isConnected} = useNetInfo();

  const getClassDetails = async id => {
    try {
      const classDetails = await firestore()
        .collection('Classes')
        .doc(id)
        .get();

      const attendanceDetails = await firestore()
        .collection('Attendance')
        .doc(id)
        .get();

      if (classDetails.exists && attendanceDetails.exists) {
        let tempArray = [];
        const totalDays = Object.keys(attendanceDetails.data()).length;
        const studentDetails = classDetails.data().studentDetails;
        const totalAttendance = classDetails.data().totalAttendance;
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
      if (jsonData) {
        // const granted = await PermissionsAndroid.request(
        //   PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        //   {
        //     title: 'Storage Permission Required',
        //     message: 'This app needs access to your storage to save files',
        //     buttonPositive: 'OK',
        //   },
        // );

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
                setSuccess(null);
                handleCloseGenerateReportModal(false);
              }, 2000);
            })
            .catch(error => {
              setError(error.message);
              setSuccess(null);
            });
        } else {
          setError('Write external storage permission denied');
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };

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
                  setShowLoader(null);
                  setError(null);
                  setSuccess(null);
                }}>
                <Ionicons
                  name="close"
                  size={FONTSIZE.size_30}
                  color={COLORS.primaryDark}></Ionicons>
              </TouchableOpacity>
            </View>
            <Text style={styles.GenerateReportTitle}>Generate Report</Text>
            <Text style={styles.GenerateReportTextInfo}>
              Attendance report of this class will be downloaded shortly
            </Text>
            <View style={styles.ButtonView}>
              <TouchableOpacity
                onPress={() => {
                  setShowLoader(true);
                  handleGenerateReport();
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

export default GenerateReportModal;

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
  ButtonView: {
    marginTop: SPACING.space_20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  GenerateReportButton: {
    width: '48%',
    backgroundColor: COLORS.primaryDark,
    padding: SPACING.space_12,
    borderRadius: 50,
  },
  GenerateReportText: {
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
