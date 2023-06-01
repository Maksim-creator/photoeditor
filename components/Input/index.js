import React, { useEffect, useRef } from 'react';
import { StyleSheet, TextInput, Text, Pressable, Keyboard, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const initialPlace = {
  x: Dimensions.get('screen').width / 2 - 50,
  y: -250,
  rotate: '0deg',
};

const Input = ({
  onChange,
  handleSetEditableIdx,
  setIsEditable,
  input,
  setIsBucketVisible,
  bucketPosition,
  scaleUpAnimation,
  scaleDownAnimation,
  removeInput,
}) => {
  const inputRef = useRef();

  const { isEditable, isBold, isItalic, fontSize, color, value } = input;

  useEffect(() => {
    if (isEditable) {
      inputRef.current?.focus();
    }
  }, [isEditable]);

  const translateX = useSharedValue(initialPlace.x);
  const translateY = useSharedValue(initialPlace.y);

  const context = useSharedValue({ y: 0, x: 0 });

  const onDrag = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value, x: translateX.value };
      runOnJS(setIsBucketVisible)(true);
    })
    .onUpdate((e) => {
      if (
        translateX.value >= bucketPosition.left - 20 &&
        translateX.value <= bucketPosition.left + 20 &&
        translateY.value + initialPlace.y + 10 >= bucketPosition.bottom &&
        translateY.value + initialPlace.y - 30 <= bucketPosition.bottom
      ) {
        runOnJS(scaleUpAnimation.start)();
      } else {
        runOnJS(scaleDownAnimation.start)();
      }
      translateY.value = e.translationY + context.value.y;
      translateX.value = e.translationX + context.value.x;
    })
    .onEnd((e) => {
      if (
        translateX.value >= bucketPosition.left - 20 &&
        translateX.value <= bucketPosition.left + 20 &&
        translateY.value + initialPlace.y + 10 >= bucketPosition.bottom &&
        translateY.value + initialPlace.y - 30 <= bucketPosition.bottom
      ) {
        runOnJS(removeInput)();
      }

      runOnJS(setIsBucketVisible)(false);
    });

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const rotation = useSharedValue(initialPlace.rotate);
  const savedRotation = useSharedValue(1);

  const rotateGesture = Gesture.Rotation()
    .onUpdate((e) => {
      rotation.value = savedRotation.value + e.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(isEditable ? initialPlace.x : translateX.value, {
            mass: 0.5,
            stiffness: 150,
          }),
        },
        {
          translateY: withSpring(isEditable ? initialPlace.y : translateY.value, {
            mass: 0.5,
            stiffness: 150,
          }),
        },
        {
          scale: isEditable ? 1 : scale.value,
        },
        {
          rotate: isEditable ? initialPlace.rotate : `${(rotation.value / Math.PI) * 180}deg`,
        },
      ],
    };
  });

  const composedGestures = Gesture.Simultaneous(rotateGesture, pinchGesture, onDrag);

  return (
    <GestureDetector gesture={composedGestures}>
      <Animated.View style={[containerStyle, { top: -350 }]}>
        {!isEditable ? (
          <Pressable onPress={() => setIsEditable(true)}>
            <Text style={styles.text(isBold, fontSize, isItalic, color)}>{value}</Text>
          </Pressable>
        ) : (
          <TextInput
            ref={inputRef}
            style={styles.input(isBold, fontSize, isItalic, isEditable, scale.value, color)}
            onChangeText={onChange}
            value={value}
            onSubmitEditing={Keyboard.dismiss}
            onFocus={handleSetEditableIdx}
          />
        )}
      </Animated.View>
    </GestureDetector>
  );
};

export default Input;

const styles = StyleSheet.create({
  input: (isBold, fontSize, isItalic, editable, scale, color) => ({
    paddingHorizontal: 5,
    color,
    width: '50%',
    fontStyle: isItalic ? 'italic' : 'normal',
    fontWeight: isBold ? 'bold' : '400',
    fontSize,
    fontFamily: isBold ? 'typewriter-bold' : isItalic ? 'typewriter-italic' : 'typewriter',
    transform: [{ scale }],
  }),
  text: (isBold, fontSize, isItalic, color) => ({
    paddingHorizontal: 5,
    color,
    width: '50%',
    fontFamily: isBold ? 'typewriter-bold' : isItalic ? 'typewriter-italic' : 'typewriter',
    fontStyle: isItalic ? 'italic' : 'normal',
    fontWeight: isBold ? 'bold' : '400',
    fontSize,
  }),
});
