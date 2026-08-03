import { PermissionsAndroid, Platform } from 'react-native';

export const requestMicrophonePermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Autorisation microphone',
        message: "L'application a besoin d'accéder au microphone pour la saisie vocale.",
        buttonPositive: 'Autoriser',
        buttonNegative: 'Refuser',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  return true;
};