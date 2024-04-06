import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../themes/Theme';
import Modal from 'react-native-modal';

const ViewNoteScreenOptionsModal = props => {
  const {
    top,
    modalView,
    handleOptionsModal,
    handleOpenEditNoteModalView,
    handleOpenSendNoteModalView,
    handleOpenDeleteNoteModalView,
  } = props;

  return (
    <Modal
      isVisible={modalView}
      onBackdropPress={handleOptionsModal}
      backdropOpacity={0}
      animationIn={'fadeInDown'}
      animationOut={'fadeOutUp'}
      useNativeDriver={true}>
      <View style={[styles.OptionsModal, {top: top}]}>
        <TouchableOpacity
          onPress={() => {
            handleOpenEditNoteModalView(true);
            handleOptionsModal();
          }}
          activeOpacity={0.4}
          style={styles.EditNote}>
          <Text style={styles.EditNoteText}>Edit Note</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleOpenSendNoteModalView(true);
            handleOptionsModal();
          }}
          activeOpacity={0.4}
          style={styles.EditNote}>
          <Text style={styles.EditNoteText}>Send Note</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleOpenDeleteNoteModalView(true);
            handleOptionsModal();
          }}
          activeOpacity={0.4}
          style={styles.DeleteNote}>
          <Text style={styles.DeleteNoteText}>Delete Note</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ViewNoteScreenOptionsModal;

const styles = StyleSheet.create({
  OptionsModal: {
    flexDirection: 'column',
    padding: SPACING.space_8,
    borderRadius: BORDERRADIUS.radius_10,
    backgroundColor: COLORS.primaryLight,
    position: 'absolute',
    right: SPACING.space_12,
    zIndex: 10,
    elevation: Platform.OS === 'android' ? 3 : 0,
  },
  EditNote: {
    padding: SPACING.space_8,
  },
  EditNoteText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryDark,
  },
  DeleteNote: {
    padding: SPACING.space_8,
  },
  DeleteNoteText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryDark,
  },
});
