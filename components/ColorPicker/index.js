import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const colors = [
  '#ffffff',
  '#000000',
  '#ff0000',
  '#ff8a00',
  '#5aff00',
  '#00ffbc',
  '#0001ff',
  '#c000ff',
  '#ff00b7',
];

const ColorPicker = ({ handleColorChange }) => {
  return (
    <View style={styles.container}>
      {colors.map((color) => (
        <TouchableOpacity
          onPress={() => handleColorChange(color)}
          activeOpacity={0.3}
          key={color}
          style={styles.colorItem(color)}
        />
      ))}
    </View>
  );
};

export default ColorPicker;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  colorItem: (color) => ({
    width: 25,
    height: 25,
    borderRadius: 100,
    backgroundColor: color,
    borderWidth: 2,
    borderColor: 'white',
  }),
});
