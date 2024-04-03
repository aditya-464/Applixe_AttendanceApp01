import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import CreateClassForm from '../components/CreateClassForm';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../themes/Theme';
import Ionicon from 'react-native-vector-icons/Ionicons';

const CreateClassScreen = props => {
  const {navigation} = props;

  const isClassCreationDone = () => {
    navigation.navigate('HomeScreen');
  };

  return (
    <SafeAreaView
      style={{height: '100%', backgroundColor: COLORS.primaryLight}}>
      <View style={styles.CreateClassContainer}>
        <View style={styles.TitleBar}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => navigation.navigate('HomeScreen')}
            style={styles.BackIcon}>
            <Ionicon
              name="chevron-back"
              size={FONTSIZE.size_28}
              color={COLORS.primaryDark}
            />
          </TouchableOpacity>
          <Text style={styles.CreateClassText}>Create Class</Text>
        </View>
        <CreateClassForm
          isClassCreationDone={isClassCreationDone}></CreateClassForm>
      </View>
    </SafeAreaView>
  );
};

export default CreateClassScreen;

const styles = StyleSheet.create({
  CreateClassContainer: {
    paddingHorizontal: SPACING.space_12,
  },
  TitleBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: SPACING.space_8,
  },
  BackIcon: {
    minWidth: '10%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: SPACING.space_4,
  },
  CreateClassText: {
    fontFamily: FONTFAMILY.poppins_bold,
    fontSize: FONTSIZE.size_28,
    paddingHorizontal: SPACING.space_12,
    color: COLORS.primaryDark,
  },
});
