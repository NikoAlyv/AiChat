import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {color} from '../theme/colors';
import {GoogleGenerativeAI} from '@google/generative-ai';
import {SvgImage} from '../components/SvgImages';
import {BottomSheet} from '../components/BottomSheet';
import {dataColor} from '../data/dataColor';

export const ChatScreen = () => {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<boolean>(false);
  const [colors, setColors] = useState(color.primary);
  const [messages, setMessages] = useState<
    {type: 'user' | 'ai'; text: string; timestamp: string}[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [stop, setStop] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const genAI = new GoogleGenerativeAI('Api_Key_Here');
  const model = genAI.getGenerativeModel({model: 'gemini-pro'});

  // Function to simulate typing effect
  const simulateTyping = (message: string, delay: number = 50) => {
    setLoading(true);
    setIsTyping(true);
    setTypingText('');
    let index = 0;
    typingIntervalRef.current = setInterval(() => {
      if (index < message.length) {
        setLoading(false);

        setTypingText(prev => prev + message.charAt(index));
        index++;
      } else {
        clearInterval(typingIntervalRef.current!);
        setIsTyping(false);
        setStop(false);
        setMessages(prevMessages => [
          ...prevMessages,
          {
            type: 'ai',
            text: message,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }
    }, delay);
  };

  // Function to generate AI response
  const run = async (userMessage: string) => {
    setLoading(true);
    setStop(true);
    const prompt = `Hey my assistant ${userMessage}`;
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const fullText = await response.text();
      simulateTyping(fullText);
    } catch (error) {
      console.error('Error generating content:', error);
      setLoading(false);
      setStop(false);
    }
  };

  // Function to handle stopping typing
  const handleStopTyping = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      setTypingText(''); // Clear the typing text

      // Add the partially typed message to the messages state
      if (typingText.trim()) {
        const timestamp = new Date().toLocaleTimeString();
        setMessages(prevMessages => [
          ...prevMessages,
          {type: 'ai', text: typingText, timestamp},
        ]);
      }

      setIsTyping(false);
      setStop(false);
      setLoading(false);
    }
  };

  const handleOnPress = () => {
    setStatus(false);
  };

  const handleColor = (Color: string) => {
    setColors(Color);
    setStatus(false);
  };

  // Function to handle sending message
  const handleSendMessage = () => {
    if (value.trim()) {
      const userMessage = value.trim();
      const timestamp = new Date().toLocaleTimeString();

      setMessages(prevMessages => [
        ...prevMessages,
        {type: 'user', text: userMessage, timestamp},
      ]);
      setValue('');
      run(userMessage);
    }
  };

  useEffect(() => {
    const greetingMessage = 'Hello! How can I assist you today?';
    simulateTyping(greetingMessage);
  }, []);

  return (
    <View style={styles.root}>
      <FlatList
        data={messages}
        style={{flex: 1}}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View>
            <Text
              style={[
                {
                  alignSelf: item.type === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: item.type === 'user' ? colors : '#ddd',
                  margin: 10,
                  borderRadius: 20,
                  padding: 10,
                  color: item.type === 'user' ? color.white : color.black,
                },
              ]}>
              {item.text}
            </Text>
            <Text
              style={{
                alignSelf: item.type === 'user' ? 'flex-end' : 'flex-start',
                marginHorizontal: 10,
                fontSize: 10,
                color: 'gray',
              }}>
              {item.timestamp}
            </Text>
          </View>
        )}
        ListFooterComponent={
          isTyping && typingText ? (
            <View>
              <Text
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: color.mediumGray,
                  margin: 10,
                  borderRadius: 20,
                  padding: 10,
                }}>
                {typingText}
              </Text>
            </View>
          ) : null
        }
      />
      {/* Show loading indicator */}
      {loading ? <Text>Loading...</Text> : null}
      <View style={styles.input}>
        <View style={{gap: 5, flexDirection: 'row', alignItems: 'center'}}>
          <SvgImage
            isPressable={true}
            onPress={() => setStatus(true)}
            source={require('../assets/vector/plus-circle.svg')}
          />
          <TextInput
            value={value}
            placeholder="Enter your message"
            onChangeText={setValue}
          />
        </View>

        <Pressable onPress={stop ? handleStopTyping : handleSendMessage}>
          {stop ? (
            <SvgImage source={require('../assets/vector/stop-circle.svg')} />
          ) : (
            <SvgImage
              source={require('../assets/vector/arrow-up-circle.svg')}
              color={value ? color.black : color.darkGray}
            />
          )}
        </Pressable>
      </View>
      {status && (
        <BottomSheet
          setStatus={handleOnPress}
          Children={
            <FlatList
              data={dataColor}
              numColumns={5}
              renderItem={({item}) => (
                <Pressable
                  onPress={() => handleColor(item.color)}
                  style={{
                    backgroundColor: item.color,
                    width: 50,
                    height: 50,
                    margin: 10,
                    borderRadius: 30,
                  }}
                />
              )}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: color.gray,
    justifyContent: 'flex-end',
  },
  input: {
    bottom: 0,
    borderWidth: 2,
    borderRadius: 20,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
