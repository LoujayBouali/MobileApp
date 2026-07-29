// src/features/capture/ocrService.ts
import * as TextRecognition from '@dariyd/react-native-text-recognition';

export const extractTextFromImage = async (imagePath: string): Promise<string> => {
  try {
    const result = await TextRecognition.recognize(imagePath);
    return Array.isArray(result) ? result.join('\n') : String(result);
  } catch (error) {
    console.error('Erreur OCR:', error);
    return '';
  }
};