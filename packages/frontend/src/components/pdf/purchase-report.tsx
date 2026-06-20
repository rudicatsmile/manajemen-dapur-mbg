'use client';

import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PDFLayout } from './pdf-layout';

const styles = StyleSheet.create({
  table: { width: '100%' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 4 },
  headerRow: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#333', paddingVertical: 4, fontWeight: 'bold' },
  col1: { width: '15%' },
  col2: { width: '25%' },
  col3: { width: '20%' },
  col4: { width: '20%' },
  col5: { width: '20%' },
});

interface PurchaseReportProps {
  data: Array<{ poNumber: string; supplier: string; date: string; total: number; status: string }>;
  period: string;
}

export function PurchaseReport({ data, period }: PurchaseReportProps) {
  return (
    <PDFLayout title="Laporan Pembelian" period={period}>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.col1}>No. PO</Text>
          <Text style={styles.col2}>Supplier</Text>
          <Text style={styles.col3}>Tanggal</Text>
          <Text style={styles.col4}>Total</Text>
          <Text style={styles.col5}>Status</Text>
        </View>
        {data.map((row, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.col1}>{row.poNumber}</Text>
            <Text style={styles.col2}>{row.supplier}</Text>
            <Text style={styles.col3}>{row.date}</Text>
            <Text style={styles.col4}>{row.total.toLocaleString('id-ID')}</Text>
            <Text style={styles.col5}>{row.status}</Text>
          </View>
        ))}
      </View>
    </PDFLayout>
  );
}
