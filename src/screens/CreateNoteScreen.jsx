import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import CreateNoteForm from '../components/CreateNoteForm';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../themes/Theme';
import Ionicon from 'react-native-vector-icons/Ionicons';

const CreateNoteScreen = props => {
  const {navigation} = props;

  const isNoteCreationDone = () => {
    navigation.navigate('NotesScreen');
  };

  return (
    <SafeAreaView
      style={{height: '100%', backgroundColor: COLORS.primaryLight}}>
      <View style={styles.CreateNoteContainer}>
        <View style={styles.TitleBar}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => navigation.navigate('NotesScreen')}
            style={styles.BackIcon}>
            <Ionicon
              name="chevron-back"
              size={FONTSIZE.size_28}
              color={COLORS.primaryDark}
            />
          </TouchableOpacity>
          <Text style={styles.CreateNoteText}>Create Note</Text>
        </View>
        <CreateNoteForm
          isNoteCreationDone={isNoteCreationDone}></CreateNoteForm>
      </View>
    </SafeAreaView>
  );
};

export default CreateNoteScreen;

const styles = StyleSheet.create({
  CreateNoteContainer: {
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
  CreateNoteText: {
    fontFamily: FONTFAMILY.poppins_bold,
    fontSize: FONTSIZE.size_28,
    paddingHorizontal: SPACING.space_12,
    color: COLORS.primaryDark,
  },
});
