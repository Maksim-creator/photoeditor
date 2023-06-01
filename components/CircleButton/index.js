import { Ionicons } from '@expo/vector-icons';
import { View, Pressable, StyleSheet } from 'react-native';

export default function CircleButton({ onPress, iconName }) {
  return (
    <View style={styles.circleButtonContainer}>
      <Pressable style={styles.circleButton} onPress={onPress}>
        <Ionicons name={iconName} size={23} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  circleButtonContainer: {
    marginHorizontal: 5,
    backgroundColor: 'grey',
    borderRadius: 100,
    padding: 9,
  },
  circleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: 'grey',
  },
});
