import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import ColorPicker from '../ColorPicker';
import IconButton from '../IconButton';

const EditTextButtons = ({
  inputs,
  editableIdx,
  handleEditText,
  handleInputDone,
  handleColorChange,
}) => {
  return (
    <View style={styles.editableContainer}>
      <View style={styles.editTextOptionsContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%' }}>
          <View
            style={{
              backgroundColor: inputs[editableIdx].isBold ? '#bdbdbd' : 'white',
              borderRadius: 5,
              marginHorizontal: 2,
            }}>
            <IconButton icon="format-bold" color="black" onPress={() => handleEditText('isBold')} />
          </View>
          <View
            style={{
              backgroundColor: inputs[editableIdx].isItalic ? '#bdbdbd' : 'white',
              borderRadius: 5,
              marginHorizontal: 2,
            }}>
            <IconButton
              icon="format-italic"
              color="black"
              onPress={() => handleEditText('isItalic')}
            />
          </View>
          <IconButton icon="expand-less" onPress={() => handleEditText('fontSize')} color="black" />
          <IconButton icon="expand-more" color="black" onPress={() => handleEditText('fontSize')} />
        </View>
        <TouchableOpacity style={{ right: 0 }} onPress={handleInputDone}>
          <Text style={{ fontWeight: '700', fontSize: 18 }}>Done</Text>
        </TouchableOpacity>
      </View>
      <ColorPicker handleColorChange={handleColorChange} />
    </View>
  );
};

export default EditTextButtons;

const styles = StyleSheet.create({
  editTextOptionsContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
  },
  editableContainer: {
    position: 'absolute',
    // width: '90%',
    paddingHorizontal: 35,
    // zIndex: 0,
    justifyContent: 'space-between',
    height: Dimensions.get('screen').height - 40,
    paddingBottom: 40,
    paddingTop: 10,
    alignSelf: 'center',
    // backgroundColor: 'rgba(45,45,45,0.48)',
  },
});
