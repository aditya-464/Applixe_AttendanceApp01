import {
  ActivityIndicator,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Linking,
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
import {Dropdown} from 'react-native-element-dropdown';

const SendNoteModal = props => {
  const {
    handleCloseSendNoteModalView,
    sendNoteModalView,
    id,
    classesDetails,
    subject,
    content,
  } = props;
  const [showLoader, setShowLoader] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [classValue, setClassValue] = useState('');
  const [data, setData] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [custom, setCustom] = useState(false);
  const [rollValues, setRollValues] = useState('');

  const getRecipientsData = () => {
    let temp = [];
    for (let key in studentDetails) {
      if (studentDetails.hasOwnProperty(key)) {
        temp.push(studentDetails[key]);
      }
    }
    if (temp.length > 1) {
      let tempJoined = temp.join(',');
      return tempJoined;
    } else {
      return temp;
    }
  };

  const handleSendNoteEveryone = async () => {
    try {
      const recipientList = getRecipientsData();
      const gmailUrl = `mailto:${recipientList}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(content)}`;

      Linking.openURL(gmailUrl);
    } catch (error) {
      console.log(error);
    }
  };

  const hasSpecialCharacters = str => {
    const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?]+/;
    if (format.test(str)) {
      return true;
    } else {
      return false;
    }
  };

  const isRollsValCorrect = () => {
    let str = rollValues;
    str.trim();
    if (str[0] === ',' || str[str.length - 1] === ',') {
      return false;
    }
    if (hasSpecialCharacters(str)) {
      return false;
    }
    for (let i = 0; i < str.length; i++) {
      if (
        (str[i] >= 'A' && str[i] <= 'Z') ||
        (str[i] >= 'a' && str[i] <= 'z')
      ) {
        return false;
      }
    }

    return true;
  };

  const getCustomRecipientsData = () => {
    let str = rollValues.trim();
    str += ',';
    let tempArr = [];
    let tempStr = '';
    for (let i = 0; i < str.length; i++) {
      if (str[i] === ',') {
        tempArr.push(tempStr);
        tempStr = '';
      } else {
        tempStr += str[i];
      }
    }
    let recipientArr = [];
    for (let i = 0; i < tempArr.length; i++) {
      if (studentDetails.hasOwnProperty(tempArr[i])) {
        recipientArr.push(studentDetails[tempArr[i]]);
      }
    }
    return recipientArr;
  };

  const handleSendNoteCustom = async () => {
    try {
      const check = isRollsValCorrect();
      if (check) {
        const customRecipientList = getCustomRecipientsData();
        const gmailUrl = `mailto:${customRecipientList}?subject=${encodeURIComponent(
          subject,
        )}&body=${encodeURIComponent(content)}`;

        Linking.openURL(gmailUrl);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getClassesList = () => {
    if (classesDetails !== null) {
      let temp = [];
      for (let i = 0; i < classesDetails.length; i++) {
        let classKey =
          classesDetails[i].initials +
          '-' +
          classesDetails[i].branch +
          '-' +
          classesDetails[i].semester +
          '-' +
          classesDetails[i].section;

        temp.push({
          label: classKey,
          value: classesDetails[i].id,
        });
      }
      setData(temp);
    }
  };

  const getStudentsData = async () => {
    try {
      const res = await firestore().collection('Classes').doc(classValue).get();
      if (res.exists) {
        const tempStudentDetails = res.data().studentDetails;
        let temp = {};
        for (let i = 0; i < tempStudentDetails.length; i++) {
          temp[tempStudentDetails[i].roll] = tempStudentDetails[i].email;
        }
        setStudentDetails(temp);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (classValue !== '') {
      getStudentsData();
    }
  }, [classValue]);

  useEffect(() => {
    getClassesList();
  }, [classesDetails]);

  return (
    <SafeAreaView>
      <Modal
        useNativeDriver={true}
        isVisible={sendNoteModalView}
        animationIn={'fadeInUp'}
        animationOut={'fadeOutDown'}>
        <View
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}>
          <View style={styles.SendNoteModal}>
            <View style={styles.CloseModal}>
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.CloseModalButton}
                onPress={() => {
                  handleCloseSendNoteModalView(false);
                  setError('');
                  setSuccess('');
                  setShowLoader(false);
                }}>
                <Ionicons
                  name="close"
                  size={FONTSIZE.size_30}
                  color={COLORS.primaryDark}></Ionicons>
              </TouchableOpacity>
            </View>
            <Text style={styles.SendNoteTitle}>Send Note</Text>

            {data !== null && (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {/* <Text>Select Class</Text> */}
                <View style={{flex: 1}}>
                  <Dropdown
                    style={styles.Dropdown}
                    containerStyle={styles.ContainerStyle}
                    placeholderStyle={styles.PlaceholderStyle}
                    selectedTextStyle={styles.SelectedTextStyle}
                    itemContainerStyle={styles.ItemContainerStyle}
                    itemTextStyle={styles.ItemTextStyle}
                    data={data}
                    autoScroll={false}
                    maxHeight={200}
                    minHeight={100}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Class"
                    value={classValue}
                    onChange={item => {
                      setClassValue(item.value);
                    }}
                    fontFamily={FONTFAMILY.poppins_regular}
                  />
                </View>
              </View>
            )}

            {custom && (
              <View style={styles.CustomView}>
                <TextInput
                  style={styles.InputField}
                  placeholder="Enter class rolls..."
                  placeholderTextColor={COLORS.placeholder}
                  value={rollValues}
                  onChangeText={text => setRollValues(text)}
                  numberOfLines={1}
                  keyboardType="default"></TextInput>
              </View>
            )}

            <View
              style={[
                styles.ButtonView,
                {
                  justifyContent:
                    custom === true ? 'flex-end' : 'space-between',
                },
              ]}>
              {!custom && (
                <TouchableOpacity
                  disabled={classValue === '' ? true : false}
                  onPress={() => {
                    Keyboard.dismiss();
                    handleSendNoteEveryone();
                  }}
                  activeOpacity={0.6}
                  style={[
                    styles.SendNoteButton,
                    {backgroundColor: COLORS.primaryLight},
                  ]}>
                  {!showLoader && (
                    <Text
                      style={[
                        styles.SendNoteText,
                        {color: COLORS.primaryDark},
                      ]}>
                      Everyone
                    </Text>
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
              {!custom && (
                <TouchableOpacity
                  disabled={classValue === '' ? true : false}
                  onPress={() => {
                    Keyboard.dismiss();
                    setCustom(true);
                    //   handleSendNote();
                  }}
                  activeOpacity={0.6}
                  style={styles.SendNoteButton}>
                  {!showLoader && (
                    <Text style={styles.SendNoteText}>Custom</Text>
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
              {custom && (
                <TouchableOpacity
                  disabled={classValue === '' ? true : false}
                  onPress={() => {
                    Keyboard.dismiss();
                    handleSendNoteCustom();
                  }}
                  activeOpacity={0.6}
                  style={styles.SendNoteButton}>
                  {!showLoader && <Text style={styles.SendNoteText}>Send</Text>}
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

            {success == '' && error == '' && (
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

export default SendNoteModal;

const styles = StyleSheet.create({
  SendNoteModal: {
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
  SendNoteTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_28,
    color: COLORS.primaryDark,
  },
  Dropdown: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    borderWidth: 0.7,
    borderColor: COLORS.placeholder,
    paddingHorizontal: SPACING.space_16,
    paddingVertical: SPACING.space_8,
    marginVertical: SPACING.space_10,
  },
  PlaceholderStyle: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.placeholder,
  },
  ContainerStyle: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    marginTop: SPACING.space_10,
    overflow: 'hidden',
  },
  SelectedTextStyle: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryDark,
  },
  ItemContainerStyle: {},
  ItemTextStyle: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryDark,
  },
  CustomView: {
    marginVertical: SPACING.space_10,
  },
  InputField: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    marginTop: SPACING.space_4,
    paddingHorizontal: SPACING.space_16,
    borderWidth: 0.7,
    borderRadius: 10,
    borderColor: COLORS.placeholder,
    color: COLORS.primaryDark,
  },
  ButtonView: {
    marginTop: SPACING.space_20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  SendNoteButton: {
    width: '48%',
    backgroundColor: COLORS.primaryDark,
    padding: SPACING.space_12,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
  },
  SendNoteText: {
    fontFamily: FONTFAMILY.poppins_regular,
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
