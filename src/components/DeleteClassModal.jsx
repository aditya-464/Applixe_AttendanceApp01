import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
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
import {refreshDetails} from '../redux/refreshHomeScreen';

const DeleteClassModal = props => {
  const {
    handleCloseDeleteClassModal,
    deleteClassModalView,
    id,
    handleMoveToHomeScreen,
  } = props;
  const {uid} = useSelector(state => state.authDetails);
  const dispatch = useDispatch();
  const [classesData, setClassesData] = useState(null);
  const [showLoader, setShowLoader] = useState(false);

  const handleDeleteClass = async () => {
    try {
      const deleteClass = await firestore()
        .collection('Classes')
        .doc(id)
        .delete();

      const deleteAttendance = await firestore()
        .collection('Attendance')
        .doc(id)
        .delete();

      const deleteTopics = await firestore()
        .collection('Topics')
        .doc(id)
        .delete();

      if (classesData) {
        await firestore()
          .collection('Users')
          .doc(uid)
          .set(
            {
              classes: classesData,
            },
            {merge: true},
          )
          .then(() => {
            dispatch(refreshDetails());
            // handleCloseDeleteClassModal(false);
            handleMoveToHomeScreen();
            setTimeout(() => {
              setShowLoader(false);
            }, 3000);
          });
      }
    } catch (error) {
      console.log(error);
      setShowLoader(false);
    }
  };

  const getUserDetails = async () => {
    const userDetails = await firestore().collection('Users').doc(uid).get();
    if (userDetails.exists) {
      let tempArray = userDetails.data().classes;
      tempArray = tempArray.filter(item => item.id !== id);
      setClassesData(tempArray);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <SafeAreaView>
      <Modal
        useNativeDriver={true}
        isVisible={deleteClassModalView}
        animationIn={'fadeInUp'}
        animationOut={'fadeOutDown'}>
        <View
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}>
          <View style={styles.DeleteClassModal}>
            <View style={styles.CloseModal}>
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.CloseModalButton}
                onPress={() => handleCloseDeleteClassModal(false)}>
                <Ionicons
                  name="close"
                  size={FONTSIZE.size_30}
                  color={COLORS.primaryDark}></Ionicons>
              </TouchableOpacity>
            </View>
            <Text style={styles.DeleteClassTitle}>Delete Class</Text>
            <Text style={styles.DeleteClassTextInfo}>
              Are you certain you wish to delete this class?
            </Text>
            <View style={styles.ButtonView}>
              <TouchableOpacity
                onPress={() => {
                  handleDeleteClass();
                  setShowLoader(true);
                }}
                activeOpacity={0.6}
                style={styles.DeleteClassButton}>
                {!showLoader && <Text style={styles.DeleteClassText}>Yes</Text>}
                {showLoader && (
                  <ActivityIndicator
                    animating={showLoader}
                    size={26}
                    color={COLORS.primaryLight}
                  />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.DummyText}>-</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DeleteClassModal;

const styles = StyleSheet.create({
  DeleteClassModal: {
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
  DeleteClassTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_28,
    color: COLORS.primaryDark,
  },
  DeleteClassTextInfo: {
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
  DeleteClassButton: {
    width: '48%',
    backgroundColor: COLORS.primaryDark,
    padding: SPACING.space_12,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
  },
  DeleteClassText: {
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
});
