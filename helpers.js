export const isInBucketRange = (translateX, translateY, bucketPosition, initialPlace) =>
  translateX.value >= bucketPosition.left - 20 &&
  translateX.value <= bucketPosition.left + 20 &&
  translateY.value + initialPlace.y + 10 >= bucketPosition.bottom &&
  translateY.value + initialPlace.y - 30 <= bucketPosition.bottom;
