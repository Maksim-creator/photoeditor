import React from 'react';
import { StyleSheet, Image, Dimensions } from 'react-native';

const ImageViewer = ({ placeholderImageSource, selectedImage }) => {
  const imageSource = selectedImage !== null ? { uri: selectedImage } : placeholderImageSource;

  return <Image source={imageSource} style={styles.image} />;
};

export default ImageViewer;

const styles = StyleSheet.create({
  image: {
    alignSelf: 'center',
    width: Dimensions.get('screen').width - 20,
    height: Dimensions.get('screen').height - 70,
    borderRadius: 18,
  },
});
