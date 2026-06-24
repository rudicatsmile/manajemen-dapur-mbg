'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useSupplierMessages, useSendSupplierMessage, type SupplierMessage } from '@/hooks/queries/use-supplier-messages';

function fTime(d: string) {
  return new Date(d).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function SupplierChatCard({ supplierId }: { supplierId: number }) {
  const { data, isLoading } = useSupplierMessages(supplierId);
  const sendMessage = useSendSupplierMessage(supplierId);
  const [body, setBody] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = [...(data?.data ?? [])].reverse();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSend = () => {
    const trimmed = body.trim();
    if (!trimmed) return;
    sendMessage.mutate({ body: trimmed }, { onSuccess: () => setBody('') });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card>
      <CardHeader className="border-b py-3">
        <CardTitle className="text-base">Pesan dengan Supplier</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="py-10 text-center text-muted-foreground">Memuat...</div>
          ) : messages.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">Belum ada pesan.</div>
          ) : (
            messages.map((msg: SupplierMessage) => {
              const isInternal = msg.senderType === 'INTERNAL';
              return (
                <div key={msg.id} className={cn('flex', isInternal ? 'justify-end' : 'justify-start')}>
                  <div className={cn(
                    'max-w-[75%] rounded-lg px-3 py-2 text-sm',
                    isInternal ? 'bg-primary text-primary-foreground' : 'bg-muted',
                  )}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium opacity-80">
                        {isInternal ? msg.senderUser?.name : msg.senderSupplierUser?.name}
                      </span>
                      {msg.purchaseOrder && (
                        <Badge variant="outline" className="text-[10px] px-1 py-0">
                          {msg.purchaseOrder.poNumber}
                        </Badge>
                      )}
                    </div>
                    <p className="whitespace-pre-wrap">{msg.body}</p>
                    <div className={cn('text-[10px] mt-1', isInternal ? 'opacity-70' : 'text-muted-foreground')}>
                      {fTime(msg.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="border-t p-3 flex gap-2">
          <Input
            placeholder="Tulis pesan..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSend} disabled={!body.trim() || sendMessage.isPending}>
            {sendMessage.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
