'use client';

import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: 'Helvetica' },
  header: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#333', paddingBottom: 10 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#16a34a' },
  headerSubtitle: { fontSize: 8, color: '#666', marginTop: 4 },
  footer: { position: 'absolute', bottom: 20, left: 30, right: 30, textAlign: 'center', fontSize: 8, color: '#999' },
  content: { flex: 1 },
});

interface PDFLayoutProps {
  title: string;
  period?: string;
  children: React.ReactNode;
}

export function PDFLayout({ title, period, children }: PDFLayoutProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dapur MBG</Text>
          <Text style={styles.headerSubtitle}>{title}{period ? ` - ${period}` : ''}</Text>
        </View>
        <View style={styles.content}>{children}</View>
        <Text style={styles.footer}>Dicetak pada {new Date().toLocaleDateString('id-ID')}</Text>
      </Page>
    </Document>
  );
}
