import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { VictoryPie, VictoryLine, VictoryChart } from 'victory-native';
import { getMonthlyTotal, getSpendingByCategory, getMonthlyEvolution } from '../../infrastructure/database/documentrepos';

export default function DashboardScreen() {
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [byCategory, setByCategory] = useState([]);
  const [evolution, setEvolution] = useState([]);

  useEffect(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    getMonthlyTotal(currentMonth).then(setMonthlyTotal);
    getSpendingByCategory(currentMonth).then(setByCategory);
    getMonthlyEvolution(6).then(setEvolution);
  }, []);

  return (
    <View>
      <Text>Total du mois : {monthlyTotal.toFixed(2)} TND</Text>

      <VictoryPie
        data={byCategory.map((c: any) => ({ x: c.name, y: c.total }))}
        colorScale="qualitative"
      />

      <VictoryChart>
        <VictoryLine
          data={evolution.map((e: any) => ({ x: e.month, y: e.total }))}
        />
      </VictoryChart>
    </View>
  );
}