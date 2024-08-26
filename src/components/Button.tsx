import {Text, Pressable, ViewStyle, StyleProp, StyleSheet} from 'react-native';
import React from 'react';
import {color} from '../theme/colors';

interface IButton {
  title: string;
  correct?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}
export const Button: React.FC<IButton> = ({title, onPress, correct, style}) => {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      <Text
        style={[
          styles.text,
          typeof correct === 'boolean' &&
            (correct ? styles.correct : styles.false),
        ]}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {},
  correct: {
    color: color.green,
    borderColor: color.green,
  },
  false: {
    color: color.red,
    borderColor: color.red,
  },
  text: {
    borderWidth: 2.5,
    paddingVertical: 15,
    backgroundColor: color.white,
    borderRadius: 30,
    textAlign: 'center',
    color: color.black,
    borderColor: color.white,
  },
});
