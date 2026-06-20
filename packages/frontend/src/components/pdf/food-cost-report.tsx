'use client';

import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PDFLayout } from './pdf-layout';

const styles = StyleSheet.create({
  table: { width: '100%' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 4 },
  headerRow: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#333', paddingVertical: 4, fontWeight: 'bold' },
  col1: { width: '25%' },
  col2: { width: '20%' },
  col3: { width: '20%' },
  col4: { width: '15%' },
  col5: { width: '20%' },
});

interface FoodCostReportProps {
  data: Array<{ recipe: string; costPerServing: number; sellingPrice: number; foodCostPct: number; margin: number }>;
  period: string;
}

export function FoodCostReport({ data, period }: FoodCostReportProps) {
  return (
    <PDFLayout title="Laporan Food Cost" period={period}>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.col1}>Resep</Text>
          <Text style={styles.col2}>Biaya/Porsi</Text>
          <Text style={styles.col3}>Harga Jual</Text>
          <Text style={styles.col4}>Food Cost</Text>
          <Text style={styles.col5}>Margin</Text>
        </View>
        {data.map((row, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.col1}>{row.recipe}</Text>
            <Text style={styles.col2}>{row.costPerServing.toLocaleString('id-ID')}</Text>
            <Text style={styles.col3}>{row.sellingPrice.toLocaleString('id-ID')}</Text>
            <Text style={styles.col4}>{row.foodCostPct.toFixed(1)}%</Text>
            <Text style={styles.col5}>{row.margin.toLocaleString('id-ID')}</Text>
          </View>
        ))}
      </View>
    </PDFLayout>
  );
}
