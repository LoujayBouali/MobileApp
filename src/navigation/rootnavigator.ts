// src/navigation/RootNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DashboardScreen from '../features/dashboard/DashboardScreen';
import CaptureScreen from '../features/capture/CaptureScreen';
import DocumentFormScreen from '../features/documents/DocumentFormScreen';
import DocumentListScreen from '../features/documents/DocumentListScreen';
import DocumentDetailScreen from '../features/documents/DocumentDetailScreen';
import SettingsScreen from '../features/settings/SettingsScreen';

const Tab = createBottomTabNavigator();
const DocsStack = createNativeStackNavigator();

function DocumentsStackNavigator() {
  return (
    <DocsStack.Navigator>
      <DocsStack.Screen name="DocumentList" component={DocumentListScreen} options={{ title: 'Documents' }} />
      <DocsStack.Screen name="DocumentDetail" component={DocumentDetailScreen} options={{ title: 'Détail' }} />
      <DocsStack.Screen name="DocumentForm" component={DocumentFormScreen} options={{ title: 'Nouveau document' }} />
    </DocsStack.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Scanner" component={ScannerScreen} />
        <Tab.Screen name="Documents" component={DocumentsStackNavigator} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}