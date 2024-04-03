import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Formik} from 'formik';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../themes/Theme';
import {createNoteSchema} from './FormValidationSchemas/CreateNoteValidationSchema';
import {useDispatch, useSelector} from 'react-redux';
import {refreshNotesDetails} from '../redux/refreshNotesScreen';
import firestore from '@react-native-firebase/firestore';

const CreateNoteForm = props => {
  const {isNoteCreationDone} = props;
  const {uid} = useSelector(state => state.authDetails);
  const [showLoader, setShowLoader] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const handleCreateNote = async values => {
    try {
      let {subject, content} = values;
      subject = subject.trim();
      content = content.trim();

      const createNote = await firestore().collection('Notes').add({
        content: content,
      });

      const getOldNotesArray = await firestore()
        .collection('Users')
        .doc(uid)
        .get();

      if (getOldNotesArray && createNote) {
        const tempArray = getOldNotesArray.data().notes;
        tempArray.push({
          id: createNote.id,
          subject: subject,
          bgcolor: tempArray.length % 2 == 0 ? 'dark' : 'light',
        });

        await firestore()
          .collection('Users')
          .doc(uid)
          .update({
            notes: tempArray,
          })
          .then(() => {
            dispatch(refreshNotesDetails());
            isNoteCreationDone();
            setTimeout(() => {
              setShowLoader(false);
            }, 2000);
          });
      }
    } catch (error) {
      setError(error.message);
      setShowLoader(false);

      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  return (
    <>
      <Formik
        validationSchema={createNoteSchema}
        initialValues={{subject: '', content: ''}}
        onSubmit={values => handleCreateNote(values)}>
        {({handleChange, handleBlur, handleSubmit, values, errors}) => (
          <ScrollView style={styles.CreateNoteForm}>
            <View style={styles.FormField}>
              <View style={styles.FormFieldIonicons}>
                <Ionicons
                  name="information-circle"
                  size={FONTSIZE.size_24}
                  color={COLORS.placeholder}></Ionicons>
              </View>
              <TextInput
                name="subject"
                style={styles.InputField}
                onChangeText={handleChange('subject')}
                onBlur={handleBlur('subject')}
                value={values.subject}
                keyboardType="default"
                numberOfLines={1}
                placeholder="Subject"
                placeholderTextColor={COLORS.placeholder}
              />
            </View>
            <View style={styles.FormField}>
              <View style={styles.FormFieldIonicons}>
                <MaterialIcons
                  name="message"
                  size={FONTSIZE.size_24}
                  color={COLORS.placeholder}></MaterialIcons>
              </View>
              <TextInput
                name="content"
                style={styles.InputField}
                onChangeText={handleChange('content')}
                onBlur={handleBlur('content')}
                value={values.content}
                keyboardType="default"
                // numberOfLines={3}
                // multiline={true}
                placeholder="Content"
                placeholderTextColor={COLORS.placeholder}
              />
            </View>

            <TouchableOpacity
              disabled={
                errors.content ||
                errors.subject ||
                values.content === '' ||
                values.subject === ''
                  ? true
                  : false
              }
              onPress={() => {
                handleSubmit();
                setShowLoader(true);
                setError(null);
              }}
              activeOpacity={0.6}
              style={styles.CreateNoteBtn}>
              {!showLoader && <Text style={styles.CreateNoteText}>Create</Text>}
              {showLoader && (
                <ActivityIndicator
                  animating={showLoader}
                  size={26}
                  color={COLORS.primaryLight}
                />
              )}
            </TouchableOpacity>

            <View style={{marginTop: SPACING.space_15}}>
              {error && <Text style={styles.FormFieldError}>{error}</Text>}
              {errors.subject && (
                <Text style={styles.FormFieldError}>{errors.subject}</Text>
              )}
              {errors.content && (
                <Text style={styles.FormFieldError}>{errors.content}</Text>
              )}
            </View>
          </ScrollView>
        )}
      </Formik>
    </>
  );
};

export default CreateNoteForm;

const styles = StyleSheet.create({
  CreateNoteForm: {
    paddingLeft: SPACING.space_12,
    paddingRight: SPACING.space_12,
    backgroundColor: COLORS.primaryLight,
  },
  FormField: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.space_2,
    paddingBottom: SPACING.space_2,
  },
  FormFieldIonicons: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: SPACING.space_12,
  },
  InputField: {
    flex: 1,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    display: 'flex',
    justifyContent: 'center',
    marginTop: SPACING.space_4,
    borderBottomWidth: 0.2,
    borderColor: '#cccccc',
    color: COLORS.primaryDark,
  },
  CreateNoteBtn: {
    width: '100%',
    backgroundColor: COLORS.primaryDark,
    padding: SPACING.space_10,
    marginTop: SPACING.space_28,
    borderRadius: 100,
  },
  CreateNoteText: {
    color: COLORS.primaryLight,
    textAlign: 'center',
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_16,
  },
  FormFieldError: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.absent,
  },
});
