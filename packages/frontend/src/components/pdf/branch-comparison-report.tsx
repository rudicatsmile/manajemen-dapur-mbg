'use client';

import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PDFLayout } from './pdf-layout';

const styles = StyleSheet.create({
  table: { width: '100%' },
  headerRow: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#333', paddingVertical: 4, fontWeight: 'bold' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 4 },
  totalRow: { flexDirection: 'row', borderTopWidth: 2, borderTopColor: '#333', paddingVertical: 5, fontWeight: 'bold' },
  branch: { width: '24%' },
  num: { width: '19%', textAlign: 'right' },
});

export interface BranchComparisonRow {
  branchName: string;
  revenue: number;
  foodCostPercentage: number;
  wasteValue: number;
  purchaseTotal: number;
}

interface Props {
  data: BranchComparisonRow[];
  totals: { revenue: number; foodCostPercentage: number; wasteValue: number; purchaseTotal: number };
  period: string;
}

const rp = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

export function BranchComparisonReport({ data, totals, period }: Props) {
  return (
    <PDFLayout title="Perbandingan Performa Cabang" period={period}>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.branch}>Cabang</Text>
          <Text style={styles.num}>Revenue</Text>
          <Text style={styles.num}>Food Cost %</Text>
          <Text style={styles.num}>Waste</Text>
          <Text style={styles.num}>Pembelian</Text>
        </View>
        {data.map((row, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.branch}>{row.branchName}</Text>
            <Text style={styles.num}>{rp(row.revenue)}</Text>
            <Text style={styles.num}>{row.foodCostPercentage.toFixed(1)}%</Text>
            <Text style={styles.num}>{rp(row.wasteValue)}</Text>
            <Text style={styles.num}>{rp(row.purchaseTotal)}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.branch}>Total / Rata-rata</Text>
          <Text style={styles.num}>{rp(totals.revenue)}</Text>
          <Text style={styles.num}>{totals.foodCostPercentage.toFixed(1)}%</Text>
          <Text style={styles.num}>{rp(totals.wasteValue)}</Text>
          <Text style={styles.num}>{rp(totals.purchaseTotal)}</Text>
        </View>
      </View>
    </PDFLayout>
  );
}
