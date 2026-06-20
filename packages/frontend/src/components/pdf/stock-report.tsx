'use client';

import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PDFLayout } from './pdf-layout';

const styles = StyleSheet.create({
  table: { width: '100%' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 4 },
  headerRow: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#333', paddingVertical: 4, fontWeight: 'bold' },
  col1: { width: '30%' },
  col2: { width: '20%' },
  col3: { width: '15%' },
  col4: { width: '15%' },
  col5: { width: '20%' },
});

interface StockReportProps {
  data: Array<{ name: string; category: string; currentStock: number; minStock: number; unit: string }>;
  period: string;
}

export function StockReport({ data, period }: StockReportProps) {
  return (
    <PDFLayout title="Laporan Stok" period={period}>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.col1}>Item</Text>
          <Text style={styles.col2}>Kategori</Text>
          <Text style={styles.col3}>Stok</Text>
          <Text style={styles.col4}>Min</Text>
          <Text style={styles.col5}>Satuan</Text>
        </View>
        {data.map((row, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.col1}>{row.name}</Text>
            <Text style={styles.col2}>{row.category}</Text>
            <Text style={styles.col3}>{row.currentStock}</Text>
            <Text style={styles.col4}>{row.minStock}</Text>
            <Text style={styles.col5}>{row.unit}</Text>
          </View>
        ))}
      </View>
    </PDFLayout>
  );
}
