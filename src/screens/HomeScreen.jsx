import {
  ActivityIndicator,
  Dimensions,
  FlatList,
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
import {DrawerActions} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';

const FlatListItem = ({
  navigation,
  id,
  subject,
  branch,
  semester,
  section,
  initials,
  bgcolor,
}) => (
  <TouchableOpacity
    onPress={() =>
      navigation.navigate('ViewClassScreen', {
        id,
        initials,
        branch,
        semester,
        section,
      })
    }
    activeOpacity={0.6}
    style={[
      styles.ClassListItem,
      {
        backgroundColor:
          bgcolor === 'dark' ? COLORS.secondaryLight : COLORS.primaryLight,
      },
    ]}>
    <View style={styles.ClassListItemTop}>
      <Text
        style={[
          styles.ClassListItemTopText,
          {
            color: bgcolor === 'dark' ? COLORS.primaryDark : COLORS.primaryDark,
          },
        ]}>
        {subject}
      </Text>
    </View>
    <View style={styles.ClassListItemBottom}>
      <Text
        style={[
          styles.ClassListItemBottomText,
          {
            color: bgcolor === 'dark' ? COLORS.primaryDark : COLORS.primaryDark,
          },
        ]}>
        {branch + ' - '}
      </Text>
      <Text
        style={[
          styles.ClassListItemBottomText,
          {
            color: bgcolor === 'dark' ? COLORS.primaryDark : COLORS.primaryDark,
          },
        ]}>
        {semester + ' - '}
      </Text>
      <Text
        style={[
          styles.ClassListItemBottomText,
          {
            color: bgcolor === 'dark' ? COLORS.primaryDark : COLORS.primaryDark,
          },
        ]}>
        {section}
      </Text>
    </View>
  </TouchableOpacity>
);

const HomeScreen = props => {
  const [classesData, setClassesData] = useState([]);
  const [showLoader, setShowLoader] = useState(true);
  const [error, setError] = useState(null);
  const {navigation} = props;
  const {uid} = useSelector(state => state.authDetails);
  const {refreshHomeValue} = useSelector(state => state.refreshHomeDetails);

  const getUpdatedClassesData = oldArray => {
    let newArray = [];
    if (oldArray.length !== 0) {
      for (let i = 0; i < oldArray.length; i++) {
        if (i & 1) {
          newArray.push({
            id: oldArray[i].id,
            subject: oldArray[i].subject,
            branch: oldArray[i].branch,
            semester: oldArray[i].semester,
            section: oldArray[i].section,
            initials: oldArray[i].initials,
            bgcolor: 'light',
          });
        } else {
          newArray.push({
            id: oldArray[i].id,
            subject: oldArray[i].subject,
            branch: oldArray[i].branch,
            semester: oldArray[i].semester,
            section: oldArray[i].section,
            initials: oldArray[i].initials,
            bgcolor: 'dark',
          });
        }
      }
    }
    return newArray;
  };

  const getUserDetails = async () => {
    try {
      const user = await firestore().collection('Users').doc(uid).get();
      if (user.data()) {
        const newArray = getUpdatedClassesData(user.data().classes);
        setClassesData(newArray);
        setShowLoader(false);
        setError(null);
      }
    } catch (error) {
      setError(error.message);
      setShowLoader(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, [refreshHomeValue, uid]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.primaryLight}}>
      <View style={styles.TitleBar}>
        <View style={styles.Title}>
          <Text style={styles.TitleText}>Home</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          activeOpacity={0.6}
          style={styles.Menu}>
          <Ionicons
            name="menu"
            size={FONTSIZE.size_30}
            color={COLORS.primaryDark}></Ionicons>
        </TouchableOpacity>
      </View>
      <View style={styles.CreateClass}>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateClassScreen')}
          activeOpacity={0.8}
          style={styles.CreateClassButton}>
          <Ionicons
            name="add"
            size={FONTSIZE.size_32}
            color={COLORS.primaryLight}></Ionicons>
        </TouchableOpacity>
      </View>

      {!showLoader && (
        <FlatList
          data={classesData}
          renderItem={({item}) => (
            <FlatListItem
              navigation={navigation}
              id={item.id}
              subject={item.subject}
              branch={item.branch}
              semester={item.semester}
              section={item.section}
              initials={item.initials}
              bgcolor={item.bgcolor}
            />
          )}
          keyExtractor={item => item.id}
          scrollEnabled={true}
          ListEmptyComponent={
            <View style={styles.EmptyListView}>
              <Text style={styles.EmptyListViewText}>No Classes</Text>
            </View>
          }
        />
      )}
      {showLoader && (
        <ActivityIndicator
          animating={showLoader}
          size={30}
          color={COLORS.placeholder}
        />
      )}
      {error && <Text style={styles.ErrorText}>{error}</Text>}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  TitleBar: {
    width: '100%',
    paddingHorizontal: SPACING.space_12,
    paddingVertical: SPACING.space_8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Title: {
    width: '80%',
  },
  TitleText: {
    fontFamily: FONTFAMILY.poppins_bold,
    fontSize: FONTSIZE.size_30,
    color: COLORS.primaryDark,
  },
  Menu: {
    width: '20%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: SPACING.space_4,
  },
  CreateClass: {
    position: 'absolute',
    top: Dimensions.get('window').height - 150,
    right: 20,
    zIndex: 10,
    elevation: Platform.OS === 'android' ? 50 : 0,
  },
  CreateClassButton: {
    width: 70,
    height: 70,
    borderRadius: 100,
    backgroundColor: COLORS.secondaryDark,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ClassListItem: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: COLORS.secondaryLight,
    marginTop: SPACING.space_8,
    marginBottom: SPACING.space_20,
    borderRadius: BORDERRADIUS.radius_10,
    padding: SPACING.space_20,
    marginHorizontal: SPACING.space_12,
    elevation: 2,
    zIndex: -10,
  },
  ClassListItemTop: {},
  ClassListItemTopText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryDark,
  },
  ClassListItemBottom: {
    display: 'flex',
    flexDirection: 'row',
  },
  ClassListItemBottomText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryDark,
    opacity: 0.8,
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
