import { useRef, useState } from 'react';
import { View, Button } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import * as ImagePicker from 'expo-image-picker';
import { extractTextFromImage } from './ocrservice';
import { extractInvoiceData } from './dataextractor';
import * as DocumentPicker from 'expo-document-picker';

export const importPdfDocument = async () => {
  const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
  if (result.canceled) return null;
  return result.assets[0].uri;
};

export default function ScannerScreen({ navigation }) {
    const cameraRef = useRef<InstanceType<typeof Camera>>(null);
    const device = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();
    const [processing, setProcessing] = useState(false);
    const processAndNavigate = async (imagePath: string) => {
    setProcessing(true);
    const rawText = await extractTextFromImage(imagePath);
    const extractedData = extractInvoiceData(rawText);
    setProcessing(false);
    navigation.navigate('Documents', {
      screen: 'DocumentForm',
      params: { extractedData, imagePath },
    });
  };

  const takePhoto = async () => {
    const photo = await cameraRef.current?.takePhoto({ flash: 'off' });
    if (photo) await processAndNavigate(`file://${photo.path}`);
  };

  const importFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) await processAndNavigate(result.assets[0].uri);
  };

  if (!hasPermission) {
    return <Button title="Autoriser la caméra" onPress={requestPermission} />;
  }
  if (!device) return null;

  return (
    <View style={{ flex: 1 }}>
      <Camera ref={cameraRef} style={{ flex: 1 }} device={device} isActive photo />
      <Button title="Prendre la photo" onPress={takePhoto} disabled={processing} />
      <Button title="Importer depuis la galerie" onPress={importFromGallery} />
    </View>
  );
}