import {
  SafeAreaView,
  StyleSheet,
  Text,
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
import DocumentPicker from 'react-native-document-picker';
import {excelToJson} from './excelToJson';
import firestore from '@react-native-firebase/firestore';
import {useDispatch} from 'react-redux';
import {refreshClassDetailsFunc} from '../redux/refreshViewClassScreen';
// import {useNetInfo} from '@react-native-community/netinfo';

const ImportDataModal = props => {
  const {
    handleCloseImportDataModal,
    importDataModalView,
    id,
    handleShowLoader,
  } = props;
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  // const {isConnected} = useNetInfo();

  const selectFile = async () => {
    try {
      setError(null);
      const doc = await DocumentPicker.pick({
        type: [DocumentPicker.types.xls, DocumentPicker.types.xlsx],
        allowMultiSelection: false,
      });
      if (doc) {
        const data = await excelToJson(doc[0].uri);
        if (data) {
          const studentsDataArray = [];
          for (let i = 1; i < data.length; i++) {
            studentsDataArray.push({
              id: data[i][0],
              roll: data[i][0],
              uniRoll: data[i][1],
              name: data[i][2],
              present: 0,
            });
          }
          await firestore()
            .collection('Classes')
            .doc(id)
            .update({
              studentDetails: studentsDataArray,
            })
            .then(() => {
              dispatch(refreshClassDetailsFunc());
              setError(null);
            })
            .catch(error => {
              setError(error.message);
            });
        }
      }
    } catch (error) {
      handleShowLoader(false);
      if (DocumentPicker.isCancel(error)) {
        console.log('Document not picked!', error);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <SafeAreaView>
      <Modal
        useNativeDriver={true}
        isVisible={importDataModalView}
        animationIn={'fadeInUp'}
        animationOut={'fadeOutDown'}>
        <View
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}>
          <View style={styles.ImportDataModal}>
            <View style={styles.CloseModal}>
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.CloseModalButton}
                onPress={() => handleCloseImportDataModal(false)}>
                <Ionicons
                  name="close"
                  size={FONTSIZE.size_30}
                  color={COLORS.primaryDark}></Ionicons>
              </TouchableOpacity>
            </View>
            <Text style={styles.ImportDataTitle}>Import Data</Text>
            <Text style={styles.ImportDataTextInfo}>
              Select the Excel file to import student data
            </Text>
            <View style={styles.ButtonView}>
              <TouchableOpacity
                onPress={() => {
                  handleCloseImportDataModal(false);
                  selectFile();
                  handleShowLoader(true);
                }}
                activeOpacity={0.6}
                style={styles.ImportDataButton}>
                <Text style={styles.ImportDataText}>Select File</Text>
              </TouchableOpacity>
            </View>
            {error === null && <Text style={styles.DummyText}>-</Text>}
            {error && <Text style={styles.ErrorText}>{error}</Text>}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ImportDataModal;

const styles = StyleSheet.create({
  ImportDataModal: {
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
  ImportDataTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_28,
    color: COLORS.primaryDark,
  },
  ImportDataTextInfo: {
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
  ImportDataButton: {
    width: '48%',
    backgroundColor: COLORS.primaryDark,
    padding: SPACING.space_12,
    borderRadius: 50,
  },
  ImportDataText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLight,
    textAlign: 'center',
  },
  DummyText: {
    marginTop: SPACING.space_10,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryLight,
  },
  ErrorText: {
    marginTop: SPACING.space_10,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.absent,
  },
});
