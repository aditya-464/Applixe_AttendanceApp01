import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../themes/Theme';
import ViewNoteScreenOptionsModal from '../components/ViewNoteScreenOptionsModal';
import EditNoteModal from '../components/EditNoteModal';
import DeleteNoteModal from '../components/DeleteNoteModal';
import {useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import SendNoteModal from '../components/SendNoteModal';

const ViewNoteScreen = props => {
  const {navigation} = props;
  const [subject, setSubject] = useState(null);
  const [content, setContent] = useState(null);
  const [titleBarHeight, setTitleBarHeight] = useState(null);
  const [modalView, setModalView] = useState(false);
  const [editNoteModalView, setEditNoteModalView] = useState(false);
  const [sendNoteModalView, setSendNoteModalView] = useState(false);
  const [deleteNoteModalView, setDeleteNoteModalView] = useState(false);
  const {refreshNotesValue} = useSelector(state => state.refreshNotesDetails);
  const [showLoader, setShowLoader] = useState(true);
  const [error, setError] = useState(null);
  const [classesDetails, setClassesDetails] = useState(null);
  const route = useRoute();
  const {uid} = useSelector(state => state.authDetails);

  const handleOptionsModal = () => {
    setModalView(prev => !prev);
  };

  // EditNoteModalView Functions
  const handleOpenEditNoteModalView = value => {
    setEditNoteModalView(value);
  };
  const handleCloseEditNoteModalView = value => {
    setEditNoteModalView(value);
  };

  // SendNoteModalView Functions
  const handleOpenSendNoteModalView = value => {
    setSendNoteModalView(value);
  };
  const handleCloseSendNoteModalView = value => {
    setSendNoteModalView(value);
  };

  // DeleteNoteModalView Functions
  const handleOpenDeleteNoteModalView = value => {
    setDeleteNoteModalView(value);
  };
  const handleCloseDeleteNoteModalView = value => {
    setDeleteNoteModalView(value);
  };

  const onLayoutTitlebar = event => {
    const {height} = event.nativeEvent.layout;
    setTitleBarHeight(height);
  };

  const getNoteDetails = async id => {
    try {
      const noteDetails = await firestore().collection('Notes').doc(id).get();
      const userDetails = await firestore().collection('Users').doc(uid).get();
      if (noteDetails.data().content && userDetails.data()) {
        setContent(noteDetails.data().content);
        const notes = userDetails.data().notes;
        for (let i = 0; i < notes.length; i++) {
          if (notes[i].id === id) {
            setSubject(notes[i].subject);
            break;
          }
        }
        setShowLoader(false);
        setError(null);
      }
    } catch (error) {
      setError(error.message);
      setShowLoader(false);
    }
  };

  const getClassesDetails = async () => {
    try {
      const res = await firestore().collection('Users').doc(uid).get();
      if (res.exists) {
        setClassesDetails(res.data().classes);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getNoteDetails(route.params?.id);
  }, [refreshNotesValue]);

  useEffect(() => {
    if (uid) {
      getClassesDetails();
    }
  }, []);

  const handleMoveToNotesScreen = () => {
    navigation.navigate('NotesScreen');
  };

  return (
    <SafeAreaView
      style={{
        zIndex: -10,
        height: '100%',
        width: '100%',
        backgroundColor: COLORS.primaryLight,
      }}>
      <View onLayout={onLayoutTitlebar} style={styles.TitleBar}>
        <TouchableOpacity
          onPress={() => navigation.navigate('NotesScreen')}
          activeOpacity={0.6}
          style={styles.BackIcon}>
          <Ionicon
            name="chevron-back"
            size={FONTSIZE.size_28}
            color={COLORS.primaryDark}
          />
        </TouchableOpacity>
        <View style={styles.TitleTextView}>
          <Text style={styles.TitleText}>Note</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={handleOptionsModal}
          style={styles.OptionsIcon}>
          <SimpleLineIcons
            name="options-vertical"
            size={22}
            color={COLORS.primaryDark}></SimpleLineIcons>
        </TouchableOpacity>
      </View>
      <ViewNoteScreenOptionsModal
        top={titleBarHeight}
        modalView={modalView}
        handleOptionsModal={handleOptionsModal}
        handleOpenEditNoteModalView={handleOpenEditNoteModalView}
        handleOpenSendNoteModalView={handleOpenSendNoteModalView}
        handleOpenDeleteNoteModalView={handleOpenDeleteNoteModalView}
      />
      <EditNoteModal
        handleCloseEditNoteModalView={handleCloseEditNoteModalView}
        editNoteModalView={editNoteModalView}
        id={route.params.id}
      />
      <SendNoteModal
        handleCloseSendNoteModalView={handleCloseSendNoteModalView}
        sendNoteModalView={sendNoteModalView}
        id={route.params.id}
        classesDetails={classesDetails}
        subject={subject}
        content={content}
      />
      <DeleteNoteModal
        handleCloseDeleteNoteModalView={handleCloseDeleteNoteModalView}
        deleteNoteModalView={deleteNoteModalView}
        id={route.params.id}
        handleMoveToNotesScreen={handleMoveToNotesScreen}
      />
      {!showLoader && (
        <ScrollView>
          <View style={styles.NoteSubject}>
            <Text style={styles.NoteSubjectText}>{subject}</Text>
          </View>
          <View style={styles.NoteContent}>
            <Text style={styles.NoteContentText}>{content}</Text>
          </View>
        </ScrollView>
      )}

      {showLoader && (
        <View style={{marginTop: SPACING.space_15}}>
          <ActivityIndicator
            size={30}
            color={COLORS.placeholder}
            animating={showLoader}
          />
        </View>
      )}

      {error && <Text style={styles.ErrorText}>{error}</Text>}
    </SafeAreaView>
  );
};

export default ViewNoteScreen;

const styles = StyleSheet.create({
  TitleBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.space_12,
    paddingVertical: SPACING.space_8,
  },
  BackIcon: {
    width: '10%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: SPACING.space_4,
  },
  TitleTextView: {
    width: '80%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: SPACING.space_10,
  },
  TitleText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_24,
    color: COLORS.primaryDark,
  },
  OptionsIcon: {
    width: '10%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  NoteSubject: {
    width: '100%',
    padding: SPACING.space_15,
    paddingBottom: SPACING.space_8,
  },
  NoteSubjectText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_24,
    color: COLORS.primaryDark,
  },
  NoteContent: {
    width: '100%',
    paddingHorizontal: SPACING.space_15,
  },
  NoteContentText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryDark,
  },
  ErrorText: {
    marginTop: SPACING.space_10,
    textAlign: 'center',
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.absent,
  },
});
