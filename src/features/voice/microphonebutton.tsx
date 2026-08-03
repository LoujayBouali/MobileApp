import { useState } from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Mic, MicOff } from 'lucide-react-native';
import { startListening, analyzeWithWit, confirmVocally } from './voiceService';
import { requestMicrophonePermission } from '../../infrastructure/permissions/microphonePermission';
import { colors } from '../../shared/theme/colors';

interface MicrophoneButtonProps {
  onResult: (data: { amount?: number; category?: string; date?: string }) => void;
}

export default function MicrophoneButton({ onResult }: MicrophoneButtonProps) {
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handlePress = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) return;

    setListening(true);
    startListening(async (transcript) => {
      setListening(false);
      setProcessing(true);
      try {
        const data = await analyzeWithWit(transcript);
        onResult(data);
        confirmVocally('Document reconnu, vérifiez les champs.');
      } catch (error) {
        console.error('Erreur analyse vocale:', error);
      } finally {
        setProcessing(false);
      }
    });
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress} disabled={processing}>
      {processing ? (
        <ActivityIndicator color="#fff" />
      ) : listening ? (
        <MicOff size={24} color="#fff" />
      ) : (
        <Mic size={24} color="#fff" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});