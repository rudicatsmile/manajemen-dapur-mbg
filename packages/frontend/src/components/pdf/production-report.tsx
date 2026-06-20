'use client';

import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PDFLayout } from './pdf-layout';

const styles = StyleSheet.create({
  table: { width: '100%' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 4 },
  headerRow: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#333', paddingVertical: 4, fontWeight: 'bold' },
  col1: { width: '25%' },
  col2: { width: '25%' },
  col3: { width: '15%' },
  col4: { width: '15%' },
  col5: { width: '20%' },
});

interface ProductionReportProps {
  data: Array<{ date: string; recipe: string; planned: number; actual: number; status: string }>;
  period: string;
}

export function ProductionReport({ data, period }: ProductionReportProps) {
  return (
    <PDFLayout title="Laporan Produksi" period={period}>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.col1}>Tanggal</Text>
          <Text style={styles.col2}>Resep</Text>
          <Text style={styles.col3}>Rencana</Text>
          <Text style={styles.col4}>Aktual</Text>
          <Text style={styles.col5}>Status</Text>
        </View>
        {data.map((row, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.col1}>{row.date}</Text>
            <Text style={styles.col2}>{row.recipe}</Text>
            <Text style={styles.col3}>{row.planned}</Text>
            <Text style={styles.col4}>{row.actual}</Text>
            <Text style={styles.col5}>{row.status}</Text>
          </View>
        ))}
      </View>
    </PDFLayout>
  );
}
