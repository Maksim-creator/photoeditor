import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Keyboard,
  Dimensions,
  Animated,
} from 'react-native';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import { Easing, useSharedValue } from 'react-native-reanimated';
import { captureRef } from 'react-native-view-shot';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';

import CircleButton from './components/CircleButton';
import ColorPicker from './components/ColorPicker';
import EditTextButtons from './components/EditTextButtons';
import EmojiList from './components/EmojiList';
import EmojiPicker from './components/EmojiPicker';
import EmojiSticker from './components/EmojiSticker';
import IconButton from './components/IconButton';
import ImageViewer from './components/ImageViewer';
import Input from './components/Input';

SplashScreen.preventAutoHideAsync();
const PlaceholderImage = require('./assets/images/background-image.png');

export default function App() {
  const imageRef = useRef();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAppOptions, setShowAppOptions] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState(null);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [inputs, setInputs] = useState([]);
  const [editableIdx, setEditableIdx] = useState(null);
  const [keyboardStatus, setKeyboardStatus] = useState('');
  const [isBucketVisible, setIsBucketVisible] = useState(false);
  const animatedOpacity = useRef(new Animated.Value(0));
  const animatedScale = useRef(new Animated.Value(1));

  if (status === null) {
    requestPermission();
  }

  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert('You did not select any image.');
    }
  };

  const onReset = () => {
    setShowAppOptions(false);
  };

  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(imageRef, {
        height: 440,
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert('Saved!');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onAddInput = () => {
    setShowAppOptions(false);
    const newArr = [...inputs];
    const uneditable = newArr
      .map((item) => ({ ...item, isEditable: false }))
      .concat({
        value: 'Enter text',
        id: uuidv4(),
        isEditable: true,
        isBold: false,
        isItalic: false,
        fontSize: 20,
        color: '#ffffff',
      });
    setInputs(uneditable);
    setEditableIdx(uneditable.length - 1);
  };

  const handleInputChange = (index, value) => {
    const newArr = [...inputs];
    newArr[index].value = value;
    setInputs(newArr);
  };

  const handleEditText = (type) => {
    const newArr = [...inputs];
    if (type === 'isBold' || type === 'isItalic') {
      newArr[editableIdx][type] = !newArr[editableIdx][type];
    } else if (type === 'fontSize') {
      newArr[editableIdx][type] = newArr[editableIdx][type] + 1;
    }
    setInputs(newArr);
  };

  const setIsEditable = (index, val) => {
    const newArr = [...inputs];
    newArr[index].isEditable = val;
    setInputs(newArr);
  };

  const handleInputDone = () => {
    setInputs((prev) => prev.map((e) => ({ ...e, isEditable: false })));

    setEditableIdx(null);
  };

  const handleSetEditableIdx = (index) => {
    setEditableIdx(index);
  };

  const handleColorChange = (color) => {
    const newArr = [...inputs];
    newArr[editableIdx].color = color;
    setInputs(newArr);
  };

  const removeInput = (id) => {
    setInputs((prev) => prev.filter((e) => e.id !== id));
  };

  const [fontsLoaded] = useFonts({
    typewriter: require('./assets/fonts/typewriter.otf'),
    'typewriter-bold': require('./assets/fonts/typewriter-bold.otf'),
    'typewriter-italic': require('./assets/fonts/typewriter-italic.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const scaleUpAnimation = Animated.timing(animatedScale.current, {
    duration: 200,
    toValue: 1.2,
    useNativeDriver: true,
    easing: Easing.linear,
  });

  const scaleDownAnimation = Animated.timing(animatedScale.current, {
    duration: 200,
    toValue: 1,
    useNativeDriver: true,
    easing: Easing.linear,
  });

  useEffect(() => {
    if (isBucketVisible) {
      Animated.timing(animatedOpacity.current, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start();
    } else {
      Animated.timing(animatedOpacity.current, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start();
    }
  }, [isBucketVisible]);

  return (
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      <GestureHandlerRootView>
        <TouchableOpacity style={styles.imageContainer} activeOpacity={1} onPress={onAddInput}>
          <View ref={imageRef} collapsable={false}>
            <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} />
            {pickedEmoji !== null ? (
              <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />
            ) : null}
            {inputs.map((input, index) => (
              <Input
                key={index}
                input={input}
                onChange={(val) => handleInputChange(index, val)}
                handleSetEditableIdx={() => handleSetEditableIdx(index)}
                setIsEditable={(val) => setIsEditable(index, val)}
                setIsBucketVisible={setIsBucketVisible}
                bucketPosition={{
                  left: Dimensions.get('screen').width / 2 - 20,
                  bottom: 20 + inputs.length * 20,
                }}
                scaleUpAnimation={scaleUpAnimation}
                scaleDownAnimation={scaleDownAnimation}
                removeInput={() => removeInput(input.id)}
              />
            ))}
          </View>
        </TouchableOpacity>
        {editableIdx === null ? (
          <View style={styles.optionsContainer}>
            <CircleButton iconName="ios-text-sharp" onPress={onAddInput} />
            <CircleButton iconName="happy-outline" onPress={onAddSticker} />
            <CircleButton iconName="ios-download-outline" onPress={onSaveImageAsync} />
          </View>
        ) : (
          <EditTextButtons
            inputs={inputs}
            editableIdx={editableIdx}
            handleEditText={handleEditText}
            handleInputDone={handleInputDone}
            handleColorChange={handleColorChange}
          />
        )}
        {editableIdx === null && isBucketVisible && (
          <Animated.View
            style={{
              opacity: animatedOpacity.current,
              transform: [{ scale: animatedScale.current }],
            }}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: 20 + inputs.length * 20,
                left: Dimensions.get('screen').width / 2 - 20,
                borderRadius: 100,
                borderWidth: 2,
                borderColor: 'white',
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <MaterialCommunityIcons name="bucket-outline" size={24} color="white" />
            </TouchableOpacity>
          </Animated.View>
        )}
        <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
          <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
        </EmojiPicker>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#25292e',
  },
  imageContainer: {
    // zIndex: 100,
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    right: 15,
    top: 10,
  },

  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
