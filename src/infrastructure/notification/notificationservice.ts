import * as Notifications from 'expo-notifications';

export const scheduleReminder = async (documentId: string, provider: string, daysFromNow: number) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Document en attente',
      body: `La facture de ${provider} n'a pas encore été traitée.`,
      data: { documentId },
    },
    trigger: { seconds: daysFromNow * 86400 },
  });
};