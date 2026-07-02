'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { Mail, Phone, Clock, CheckCircle2, Trash2, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  content: string;
  status: 'pending' | 'read' | 'archived';
  createdAt: string;
}

export default function MessagesPage() {
  const t = useTranslations('admin.messages');
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'es';
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState<'all' | 'pending' | 'read'>('all');

  const { data: messages, isLoading } = useQuery({
    queryKey: queryKeys.messages.all,
    queryFn: () => api.get<Message[]>('/messages'),
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/messages/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.pendingCount });
      toast.success('Mensaje marcado como leído');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/messages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.pendingCount });
      toast.success('Mensaje eliminado');
    },
  });

  const handleDelete = (id: string) => {
    if (confirm(t('confirmDelete'))) {
      deleteMutation.mutate(id);
    }
  };

  const filteredMessages = messages?.filter(msg => {
    if (filter === 'all') return true;
    return msg.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todos
          </Button>
          <Button 
            variant={filter === 'pending' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('pending')}
          >
            Pendientes
          </Button>
          <Button 
            variant={filter === 'read' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('read')}
          >
            Leídos
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Cargando mensajes...</div>
        ) : filteredMessages?.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <Mail className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium">{t('empty')}</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredMessages?.map((message) => (
              <div 
                key={message.id} 
                className={`p-6 flex flex-col lg:flex-row gap-6 transition-colors hover:bg-accent/50 ${message.status === 'pending' ? 'bg-primary/5' : ''}`}
              >
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        {message.name}
                        {message.status === 'pending' && (
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-primary/20">
                            Nuevo
                          </span>
                        )}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                        <a href={`mailto:${message.email}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                          <Mail className="h-4 w-4" />
                          {message.email}
                        </a>
                        {message.phone && (
                          <a href={`tel:${message.phone}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                            <Phone className="h-4 w-4" />
                            {message.phone}
                          </a>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Intl.DateTimeFormat(locale, {
                            dateStyle: 'long',
                            timeStyle: 'short',
                          }).format(new Date(message.createdAt))}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-background/50 rounded-lg p-4 border text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
                <div className="flex lg:flex-col items-center justify-end gap-2 lg:w-48 shrink-0">
                  {message.status === 'pending' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => markAsReadMutation.mutate(message.id)}
                      disabled={markAsReadMutation.isPending}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      {t('actions.markRead')}
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(message.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('actions.delete')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
