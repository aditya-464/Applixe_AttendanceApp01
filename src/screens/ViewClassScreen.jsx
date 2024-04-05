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
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import ViewClassScreenOptionsModal from '../components/ViewClassScreenOptionsModal';
import ViewRecordModal from '../components/ViewRecordModal';
import GenerateReportModal from '../components/GenerateReportModal';
import DeleteClassModal from '../components/DeleteClassModal';
import ImportDataModal from '../components/ImportDataModal';
import SelectDateModal from '../components/SelectDateModal';
import {useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
// import {useNetInfo} from '@react-native-community/netinfo';

const ViewClassScreen = props => {
  const {navigation} = props;
  const [studentsData, setStudentsData] = useState([]);
  const [titleBarHeight, setTitleBarHeight] = useState(null);
  const [actionButtonsViewHeight, setActionButtonsViewHeight] = useState(null);
  const [optionsModalView, setOptionsModalView] = useState(false);
  const [importDataModalView, setImportDataModalView] = useState(false);
  const [viewRecordModalView, setViewRecordModalView] = useState(false);
  const [generateReportModalView, setGenerateReportModalView] = useState(false);
  const [deleteClassModalView, setDeleteClassModalView] = useState(false);
  const [selectDateModalView, setSelectDateModalView] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [error, setError] = useState(null);
  const [refreshValue, setRefreshValue] = useState(0);
  const route = useRoute();
  const {refreshClassValue} = useSelector(state => state.refreshClassDetails);
  // const {isConnected} = useNetInfo();

  const onLayoutTitlebar = event => {
    const {height} = event.nativeEvent.layout;
    setTitleBarHeight(height);
  };

  const onLayoutActionButtonsView = event => {
    const {height} = event.nativeEvent.layout;
    setActionButtonsViewHeight(height);
  };

  const handleOptionsModal = () => {
    setOptionsModalView(prev => !prev);
  };

  const handleShowLoader = value => {
    setShowLoader(value);
  };

  // ImportDataModalView Functions
  const handleOpenImportDataModal = value => {
    setImportDataModalView(value);
  };
  const handleCloseImportDataModal = value => {
    setImportDataModalView(value);
  };

  // ViewRecordModalView Functions
  const handleOpenViewRecordModal = value => {
    setViewRecordModalView(value);
  };
  const handleCloseViewRecordModal = value => {
    setViewRecordModalView(value);
  };

  // GenerateReportModalView Functions
  const handleOpenGenerateReportModal = value => {
    setGenerateReportModalView(value);
  };
  const handleCloseGenerateReportModal = value => {
    setGenerateReportModalView(value);
  };
  const handleRefreshValue = () => {
    setRefreshValue(prev => prev + 1);
  };

  // DeleteClassModalView Functions
  const handleOpenDeleteClassModal = value => {
    setDeleteClassModalView(value);
  };
  const handleCloseDeleteClassModal = value => {
    setDeleteClassModalView(value);
  };

  // SelectDateModalView Functions
  const handleOpenSelectDateModal = value => {
    setSelectDateModalView(value);
  };
  const handleCloseSelectDateModal = value => {
    setSelectDateModalView(value);
  };

  const getClassDetails = async id => {
    try {
      const classDetails = await firestore()
        .collection('Classes')
        .doc(id)
        .get();
      if (classDetails._data.studentDetails) {
        setStudentsData(classDetails._data.studentDetails);
        setShowLoader(false);
        setError(null);
      }
    } catch (error) {
      setError(error.message);
      setShowLoader(false);
    }
  };

  useEffect(() => {
    getClassDetails(route.params?.id);
  }, [refreshClassValue]);

  const handleStudentClick = (id, roll, name, present) => {
    const updatedStudentsData = [];
    for (let i = 0; i < studentsData.length; i++) {
      if (studentsData[i].id !== id) {
        updatedStudentsData.push(studentsData[i]);
      } else {
        updatedStudentsData.push({
          id,
          roll,
          name,
          present: !present,
        });
      }
    }
    setStudentsData(updatedStudentsData);
  };

  const handleResetAttendance = () => {
    const updatedStudentsData = [];
    for (let i = 0; i < studentsData.length; i++) {
      updatedStudentsData.push({
        id: studentsData[i].id,
        roll: studentsData[i].roll,
        name: studentsData[i].name,
        present: 0,
      });
    }
    setStudentsData(updatedStudentsData);
  };

  const FlatListItem = ({id, roll, name, present}) => (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => handleStudentClick(id, roll, name, present)}
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

  const handleMoveToViewRecordScreen = ({
    dateAsKey,
    attendanceBinaryArray,
    topic,
  }) => {
    navigation.navigate('ViewRecordScreen', {
      initials: route.params.initials,
      branch: route.params.branch,
      semester: route.params.semester,
      section: route.params.section,
      studentsData,
      attendanceBinaryArray,
      dateAsKey,
      topic,
    });
  };

  const handleMoveToHomeScreen = () => {
    navigation.navigate('HomeScreen');
  };

  const getShortNameOfSubject = () => {};

  useEffect(() => {
    getShortNameOfSubject();
  }, [route.params]);

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
          onPress={() => navigation.navigate('HomeScreen')}
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
      <ViewClassScreenOptionsModal
        top={titleBarHeight}
        optionsModalView={optionsModalView}
        handleOptionsModal={handleOptionsModal}
        handleOpenImportDataModal={handleOpenImportDataModal}
        handleOpenViewRecordModal={handleOpenViewRecordModal}
        handleOpenGenerateReportModal={handleOpenGenerateReportModal}
        handleOpenDeleteClassModal={handleOpenDeleteClassModal}
      />
      <ImportDataModal
        handleCloseImportDataModal={handleCloseImportDataModal}
        importDataModalView={importDataModalView}
        id={route.params.id}
        handleShowLoader={handleShowLoader}
      />
      <ViewRecordModal
        handleCloseViewRecordModal={handleCloseViewRecordModal}
        viewRecordModalView={viewRecordModalView}
        id={route.params.id}
        handleMoveToViewRecordScreen={handleMoveToViewRecordScreen}
      />
      <GenerateReportModal
        handleCloseGenerateReportModal={handleCloseGenerateReportModal}
        generateReportModalView={generateReportModalView}
        id={route.params.id}
        subject={route.params.subject}
        initials={route.params.initials}
        branch={route.params.branch}
        semester={route.params.semester}
        section={route.params.section}
        refreshValue={refreshValue}
      />
      <DeleteClassModal
        handleCloseDeleteClassModal={handleCloseDeleteClassModal}
        deleteClassModalView={deleteClassModalView}
        id={route.params.id}
        handleMoveToHomeScreen={handleMoveToHomeScreen}
      />
      <SelectDateModal
        handleCloseSelectDateModal={handleCloseSelectDateModal}
        selectDateModalView={selectDateModalView}
        studentsData={studentsData}
        id={route.params.id}
        handleRefreshValue={handleRefreshValue}
      />

      {!showLoader && (
        <>
          {studentsData.length !== 0 && (
            <View style={styles.ColumnHeadings}>
              <View style={styles.RollHeading}>
                <Text style={styles.RollHeadingText}>Roll</Text>
              </View>
              <View style={styles.NameHeading}>
                <Text style={styles.NameHeadingText}>Name</Text>
              </View>
            </View>
          )}

          <FlatList
            data={studentsData}
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
            ListFooterComponentStyle={{height: actionButtonsViewHeight}}
            ListFooterComponent={<View></View>}
            ListEmptyComponent={
              <View style={styles.EmptyListView}>
                <Text style={styles.EmptyListViewText}>No Data</Text>
              </View>
            }
          />

          {studentsData.length !== 0 && (
            <View
              onLayout={onLayoutActionButtonsView}
              style={styles.ActionButtons}>
              <TouchableOpacity
                onPress={handleResetAttendance}
                activeOpacity={0.6}
                style={styles.CancelButton}>
                <Text style={styles.CancelButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleOpenSelectDateModal(true)}
                activeOpacity={0.6}
                style={styles.SubmitButton}>
                <Text style={styles.SubmitButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
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

export default ViewClassScreen;

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
    textAlign: 'center',
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
    textAlign: 'center',
  },
  ActionButtons: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.space_20,
    paddingVertical: SPACING.space_24,
    zIndex: 10,
    backgroundColor: COLORS.primaryLight,
  },
  CancelButton: {
    width: '48%',
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
    padding: SPACING.space_12,
    borderRadius: 50,
    backgroundColor: COLORS.primaryLight,
  },
  CancelButtonText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryDark,
    textAlign: 'center',
  },
  SubmitButton: {
    width: '48%',
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
    padding: SPACING.space_12,
    borderRadius: 50,
    backgroundColor: COLORS.primaryDark,
  },
  SubmitButtonText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLight,
    textAlign: 'center',
  },
  EmptyListView: {
    marginTop: SPACING.space_15,
  },
  EmptyListViewText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.placeholder,
    textAlign: 'center',
  },
  ErrorText: {
    marginTop: SPACING.space_10,
    textAlign: 'center',
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.absent,
  },
});
