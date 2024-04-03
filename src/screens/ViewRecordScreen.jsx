import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../themes/Theme';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {useRoute} from '@react-navigation/native';

const ViewRecordScreen = props => {
  const {navigation} = props;
  const [studentsDataArray, setStudentsDataArray] = useState([]);
  const [classInfoView, setClassInfoView] = useState(null);
  const [presentStudents, setPresentStudents] = useState(null);
  const [showLoader, setShowLoader] = useState(true);
  const route = useRoute();

  const onLayoutClassInfoView = event => {
    const {height} = event.nativeEvent.layout;
    setClassInfoView(height);
  };

  useEffect(() => {
    const tempArray = [];
    let count = 0;
    const prevStudentsData = route.params.studentsData;
    const prevAttendanceBinaryArray = route.params.attendanceBinaryArray;
    for (let i = 0; i < prevStudentsData.length; i++) {
      tempArray.push({
        id: prevStudentsData[i].id,
        roll: prevStudentsData[i].roll,
        name: prevStudentsData[i].name,
        present: prevAttendanceBinaryArray[i],
      });
      if (prevAttendanceBinaryArray[i] === 1) {
        ++count;
      }
    }

    setTimeout(() => {
      setShowLoader(false);
      setStudentsDataArray(tempArray);
      setPresentStudents(count);
    }, 1500);
  }, []);

  const FlatListItem = ({id, roll, name, present}) => (
    <TouchableOpacity
      disabled={true}
      activeOpacity={0.6}
      style={[
        styles.StudentDetailsItem,
        {backgroundColor: present ? COLORS.present : COLORS.absent},
      ]}>
      <View style={styles.StudentRoll}>
        <Text style={styles.StudentRollText}>{roll}</Text>
      </View>
      <View style={styles.StudentName}>
        <Text style={styles.StudentNameText}>{name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={{
        zIndex: -10,
        height: '100%',
        width: '100%',
        backgroundColor: COLORS.primaryLight,
      }}>
      <View style={styles.TitleBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.6}
          style={styles.BackIcon}>
          <Ionicon
            name="chevron-back"
            size={FONTSIZE.size_28}
            color={COLORS.primaryDark}
          />
        </TouchableOpacity>
        <View style={styles.TitleTextView}>
          <Text style={[styles.TitleText, {paddingLeft: SPACING.space_8}]}>
            {route.params.initials}
          </Text>
          <Text style={styles.TitleText}>-</Text>
          <Text style={styles.TitleText}>
            {route.params.branch}-{route.params.semester}-{route.params.section}
          </Text>
        </View>
      </View>

      {!showLoader && (
        <View style={styles.ColumnHeadings}>
          <View style={styles.RollHeading}>
            <Text style={styles.RollHeadingText}>Roll</Text>
          </View>
          <View style={styles.NameHeading}>
            <Text style={styles.NameHeadingText}>Name</Text>
          </View>
        </View>
      )}

      {studentsDataArray.length !== 0 && !showLoader && (
        <FlatList
          data={studentsDataArray}
          renderItem={({item}) => (
            <FlatListItem
              id={item.id}
              roll={item.roll}
              name={item.name}
              present={item.present}
            />
          )}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={true}
          ListFooterComponentStyle={{height: classInfoView}}
          ListFooterComponent={<View></View>}
        />
      )}

      {!showLoader && (
        <View onLayout={onLayoutClassInfoView} style={styles.AttendanceInfo}>
          <View style={styles.AttendanceDate}>
            <Text style={styles.AttendanceDateText}>Date</Text>
            <Text style={styles.AttendanceDateText}>-</Text>
            <Text style={styles.AttendanceDateText}>
              {route.params.dateAsKey}
            </Text>
          </View>
          <View style={styles.AttendanceStudentInfo}>
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <Text style={styles.AttendanceStudentInfoText}>Total</Text>
              <Text style={styles.AttendanceStudentInfoText}>-</Text>
              <Text style={styles.AttendanceStudentInfoText}>
                {studentsDataArray.length}
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <Text style={styles.AttendanceStudentInfoText}>Present</Text>
              <Text style={styles.AttendanceStudentInfoText}>-</Text>
              <Text style={styles.AttendanceStudentInfoText}>
                {presentStudents}
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }}>
              <Text style={styles.AttendanceStudentInfoText}>Topic</Text>
              <Text style={styles.AttendanceStudentInfoText}>-</Text>
              <Text style={styles.AttendanceStudentInfoText}>
                {route.params.topic}
              </Text>
            </View>
          </View>
        </View>
      )}

      {showLoader && (
        <View
          style={{
            marginTop: SPACING.space_15,
          }}>
          <ActivityIndicator
            size={30}
            color={COLORS.placeholder}
            animating={showLoader}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ViewRecordScreen;

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
  ColumnHeadings: {
    paddingHorizontal: SPACING.space_12,
    paddingVertical: SPACING.space_4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  RollHeading: {
    width: '20%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  RollHeadingText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryDark,
  },
  NameHeading: {
    width: '80%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  NameHeadingText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryDark,
  },
  StudentDetailsItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.space_12,
    paddingVertical: SPACING.space_12,
    borderBottomWidth: 0.3,
    borderColor: COLORS.primaryLight,
  },
  StudentRoll: {
    width: '20%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  StudentRollText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryDark,
  },
  StudentName: {
    width: '80%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  StudentNameText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryDark,
  },
  AttendanceInfo: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.space_20,
    zIndex: 10,
    backgroundColor: COLORS.primaryLight,
  },
  AttendanceDate: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  AttendanceDateText: {
    marginRight: SPACING.space_8,
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryDark,
  },
  AttendanceStudentInfo: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  AttendanceStudentInfoText: {
    marginRight: SPACING.space_8,
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryDark,
  },
});
