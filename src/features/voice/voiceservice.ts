import Voice from '@react-native-voice/voice';
import * as Speech from 'expo-speech';
import axios from 'axios';

const WIT_AI_TOKEN = process.env.EXPO_PUBLIC_WIT_AI_TOKEN;

export const startListening = (onResult: (text: string) => void) => {
  Voice.onSpeechResults = (e) => {
    if (e.value?.[0]) onResult(e.value[0]);
  };
  Voice.start('fr-FR');
};

export const analyzeWithWit = async (text: string) => {
  const response = await axios.get('https://api.wit.ai/message', {
    params: { q: text, v: '20250101' },
    headers: { Authorization: `Bearer ${WIT_AI_TOKEN}` },
  });

  const entities = response.data.entities;
  return {
    intent: response.data.intents?.[0]?.name,
    amount: entities['wit$amount_of_money:amount_of_money']?.[0]?.value,
    category: entities['category:category']?.[0]?.value,
    date: entities['wit$datetime:datetime']?.[0]?.value,
  };
};

export const confirmVocally = (message: string) => {
  Speech.speak(message, { language: 'fr', rate: 0.9 });
};