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
import firestore from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import {refreshDetails} from '../redux/refreshHomeScreen';
import {createClassSchema} from './FormValidationSchemas/CreateClassValidationSchema';

const CreateClassForm = props => {
  const {isClassCreationDone} = props;
  const {uid} = useSelector(state => state.authDetails);
  const [showLoader, setShowLoader] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const getInitials = subject => {
    subject = subject.trim();

    let initials = '';
    let spaceCount = 0;
    for (let i = 0; i < subject.length; i++) {
      if (i === 0) {
        initials += subject[i];
      } else {
        if (subject[i - 1] === ' ') {
          initials += subject[i];
          spaceCount++;
        }
      }
    }
    initials = initials.toUpperCase();
    if (spaceCount > 0) {
      return initials;
    } else {
      return subject;
    }
  };

  const handleCreateClass = async values => {
    try {
      let {subject, branch, semester, section} = values;
      let initials = getInitials(subject);
      subject = subject.trim();
      branch = branch.trim();
      semester = semester.trim();
      section = section.trim();

      const createClass = await firestore().collection('Classes').add({
        studentDetails: [],
        totalAttendance: [],
      });

      const getOldClassesArray = await firestore()
        .collection('Users')
        .doc(uid)
        .get();

      if (getOldClassesArray.exists && createClass) {
        const tempArray = getOldClassesArray.data().classes;
        tempArray.push({
          id: createClass.id,
          subject: subject,
          branch: branch,
          semester: semester,
          section: section,
          initials: initials,
        });

        await firestore()
          .collection('Users')
          .doc(uid)
          .update({
            classes: tempArray,
          })
          .then(() => {
            dispatch(refreshDetails());
            isClassCreationDone();
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
        validationSchema={createClassSchema}
        initialValues={{subject: '', branch: '', semester: '', section: ''}}
        onSubmit={values => handleCreateClass(values)}>
        {({handleChange, handleBlur, handleSubmit, values, errors}) => (
          <ScrollView style={styles.CreateClassForm}>
            <View style={styles.FormField}>
              <View style={styles.FormFieldIonicons}>
                <Ionicons
                  name="book"
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
                <Ionicons
                  name="git-branch"
                  size={FONTSIZE.size_24}
                  color={COLORS.placeholder}></Ionicons>
              </View>
              <TextInput
                name="branch"
                style={styles.InputField}
                onChangeText={handleChange('branch')}
                onBlur={handleBlur('branch')}
                value={values.branch}
                numberOfLines={1}
                placeholder="Branch"
                placeholderTextColor={COLORS.placeholder}
              />
            </View>
            <View style={styles.FormField}>
              <View style={styles.FormFieldIonicons}>
                <MaterialIcons
                  name="subject"
                  size={FONTSIZE.size_24}
                  color={COLORS.placeholder}></MaterialIcons>
              </View>
              <TextInput
                name="semester"
                style={styles.InputField}
                onChangeText={handleChange('semester')}
                onBlur={handleBlur('semester')}
                value={values.semester}
                keyboardType="numeric"
                numberOfLines={1}
                placeholder="Semester"
                placeholderTextColor={COLORS.placeholder}
              />
            </View>
            <View style={styles.FormField}>
              <View style={styles.FormFieldIonicons}>
                <MaterialIcons
                  name="subject"
                  size={FONTSIZE.size_24}
                  color={COLORS.placeholder}></MaterialIcons>
              </View>
              <TextInput
                name="section"
                style={styles.InputField}
                onChangeText={handleChange('section')}
                onBlur={handleBlur('section')}
                value={values.section}
                numberOfLines={1}
                placeholder="Section"
                placeholderTextColor={COLORS.placeholder}
              />
            </View>

            <TouchableOpacity
              disabled={
                errors.subject ||
                errors.branch ||
                errors.semester ||
                errors.section ||
                values.branch === '' ||
                values.subject === '' ||
                values.semester === '' ||
                values.section === ''
                  ? true
                  : false
              }
              onPress={() => {
                handleSubmit();
                setError(null);
                setShowLoader(true);
              }}
              activeOpacity={0.6}
              style={styles.CreateClassBtn}>
              {!showLoader && (
                <Text style={styles.CreateClassText}>Create</Text>
              )}
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
              {errors.branch && (
                <Text style={styles.FormFieldError}>{errors.branch}</Text>
              )}
              {errors.semester && (
                <Text style={styles.FormFieldError}>{errors.semester}</Text>
              )}
              {errors.section && (
                <Text style={styles.FormFieldError}>{errors.section}</Text>
              )}
            </View>
          </ScrollView>
        )}
      </Formik>
    </>
  );
};

export default CreateClassForm;

const styles = StyleSheet.create({
  CreateClassForm: {
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
  CreateClassBtn: {
    width: '100%',
    backgroundColor: COLORS.primaryDark,
    padding: SPACING.space_10,
    marginTop: SPACING.space_28,
    borderRadius: 100,
  },
  CreateClassText: {
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
