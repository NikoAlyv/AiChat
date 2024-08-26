import {View, Text, SafeAreaView} from 'react-native';
import React from 'react';
import {QuestionScreen} from './src/screen/Questions.Screen';
import {ChatScreen} from './src/screen/ChatScreen';

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ChatScreen />
    </SafeAreaView>
  );
};

export default App;
