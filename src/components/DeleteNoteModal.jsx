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
import {refreshNotesDetails} from '../redux/refreshNotesScreen';

const DeleteNoteModal = props => {
  const {
    handleCloseDeleteNoteModalView,
    deleteNoteModalView,
    id,
    handleMoveToNotesScreen,
  } = props;
  const {uid} = useSelector(state => state.authDetails);
  const dispatch = useDispatch();
  const [notesData, setNotesData] = useState(null);
  const [showLoader, setShowLoader] = useState(false);

  const handleDeleteNote = async () => {
    try {
      const deleteNote = await firestore().collection('Notes').doc(id).delete();

      if (notesData) {
        await firestore()
          .collection('Users')
          .doc(uid)
          .set(
            {
              notes: notesData,
            },
            {merge: true},
          )
          .then(() => {
            dispatch(refreshNotesDetails());
            handleMoveToNotesScreen();
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
    if (userDetails._exists) {
      let tempArray = userDetails._data.notes;
      tempArray = tempArray.filter(item => item.id !== id);
      setNotesData(tempArray);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <SafeAreaView>
      <Modal
        useNativeDriver={true}
        isVisible={deleteNoteModalView}
        animationIn={'fadeInUp'}
        animationOut={'fadeOutDown'}>
        <View
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}>
          <View style={styles.DeleteNoteModal}>
            <View style={styles.CloseModal}>
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.CloseModalButton}
                onPress={() => handleCloseDeleteNoteModalView(false)}>
                <Ionicons
                  name="close"
                  size={FONTSIZE.size_30}
                  color={COLORS.primaryDark}></Ionicons>
              </TouchableOpacity>
            </View>
            <Text style={styles.DeleteNoteTitle}>Delete Note</Text>
            <Text style={styles.DeleteNoteTextInfo}>
              Are you certain you wish to delete this Note?
            </Text>
            <View style={styles.ButtonView}>
              <TouchableOpacity
                onPress={() => {
                  handleDeleteNote();
                  setShowLoader(true);
                }}
                activeOpacity={0.6}
                style={styles.DeleteNoteButton}>
                {!showLoader && <Text style={styles.DeleteNoteText}>Yes</Text>}
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

export default DeleteNoteModal;

const styles = StyleSheet.create({
  DeleteNoteModal: {
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
  DeleteNoteTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_28,
    color: COLORS.primaryDark,
  },
  DeleteNoteTextInfo: {
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
  DeleteNoteButton: {
    width: '48%',
    backgroundColor: COLORS.primaryDark,
    padding: SPACING.space_12,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
  },
  DeleteNoteText: {
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
