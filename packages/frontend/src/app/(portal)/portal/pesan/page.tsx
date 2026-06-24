'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { usePortalMessages, useSendPortalMessage, type PortalMessage } from '@/hooks/queries/use-portal-messages';

function fTime(d: string) {
  return new Date(d).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function PortalPesanPage() {
  const { data, isLoading } = usePortalMessages();
  const sendMessage = useSendPortalMessage();
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pesan</h1>
        <p className="text-muted-foreground">Komunikasi langsung dengan tim purchasing</p>
      </div>

      <Card className="flex flex-col" style={{ height: 'calc(100vh - 220px)' }}>
        <CardHeader className="border-b py-3">
          <CardTitle className="text-base">Chat dengan Tim Purchasing</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <div ref={scrollRef} className="h-full overflow-y-auto p-4 space-y-3">
            {isLoading ? (
              <div className="py-10 text-center text-muted-foreground">Memuat...</div>
            ) : messages.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground">Belum ada pesan. Mulai percakapan!</div>
            ) : (
              messages.map((msg: PortalMessage) => {
                const isSupplier = msg.senderType === 'SUPPLIER';
                return (
                  <div key={msg.id} className={cn('flex', isSupplier ? 'justify-end' : 'justify-start')}>
                    <div className={cn(
                      'max-w-[75%] rounded-lg px-3 py-2 text-sm',
                      isSupplier ? 'bg-primary text-primary-foreground' : 'bg-muted',
                    )}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium opacity-80">
                          {isSupplier ? msg.senderSupplierUser?.name : msg.senderUser?.name}
                        </span>
                        {msg.purchaseOrder && (
                          <Badge variant="outline" className="text-[10px] px-1 py-0">
                            {msg.purchaseOrder.poNumber}
                          </Badge>
                        )}
                      </div>
                      <p className="whitespace-pre-wrap">{msg.body}</p>
                      <div className={cn('text-[10px] mt-1', isSupplier ? 'opacity-70' : 'text-muted-foreground')}>
                        {fTime(msg.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
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
      </Card>
    </div>
  );
}
