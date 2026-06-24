'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSupplierPrices } from '@/hooks/queries/use-supplier-messages';

const rp = (n: number) => `Rp ${Math.round(Number(n)).toLocaleString('id-ID')}`;
const fDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

export function SupplierPricesCard({ supplierId }: { supplierId: number }) {
  const { data: prices, isLoading } = useSupplierPrices(supplierId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Katalog Harga dari Supplier</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">Memuat...</div>
        ) : !prices || prices.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Supplier belum meng-update katalog harga.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Harga</TableHead>
                <TableHead>Berlaku</TableHead>
                <TableHead>Catatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prices.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.item.name}</TableCell>
                  <TableCell className="text-right">{rp(p.price)}</TableCell>
                  <TableCell>{fDate(p.effectiveDate)}{p.validUntil ? ` - ${fDate(p.validUntil)}` : ''}</TableCell>
                  <TableCell className="text-muted-foreground">{p.note ?? '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
