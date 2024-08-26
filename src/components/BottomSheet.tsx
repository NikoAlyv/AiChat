import React, {Children, ReactNode} from 'react';
import {View, StyleSheet, Animated, Pressable} from 'react-native';
import {color} from '../theme/colors';
import {normalize} from '../theme/metrics';

interface IBottomSheet {
  juniorPress?: () => void;
  middlePress?: () => void;
  seniorPress?: () => void;
  setStatus?: any;
  Children?: ReactNode;
}

export const BottomSheet: React.FC<IBottomSheet> = ({
  seniorPress,
  setStatus,
  juniorPress,
  middlePress,
  Children,
}) => {
  const slide = React.useRef(new Animated.Value(300)).current;

  const slideUp = () => {
    // Will change slide up the bottom sheet
    Animated.timing(slide, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const slideDown = () => {
    // Will slide down the bottom sheet
    Animated.timing(slide, {
      toValue: 300,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  React.useEffect(() => {
    slideUp();
  });

  const closeModal = () => {
    slideDown();

    setTimeout(() => {
      setStatus(false);
    }, 800);
  };

  return (
    <Pressable onPress={closeModal} style={styles.backdrop}>
      <Pressable style={{width: '100%', height: '25%'}}>
        <Animated.View
          style={[styles.bottomSheet, {transform: [{translateY: slide}]}]}>
          <View style={[styles.handle]} />
          <View style={styles.contain}>{Children}</View>
        </Animated.View>
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    flex: 1,
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    width: '100%',
    height: '100%',
    backgroundColor: color.white,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingHorizontal: normalize('horizontal', 15),
    gap: 20,
  },
  handle: {
    backgroundColor: color.mediumGray,
    width: 48,
    height: 5,
    marginVertical: normalize('vertical', 4),
    alignSelf: 'center',
  },
  contain: {
    gap: 10,
  },
});
