import { MessageCircle } from 'lucide-react';
import { wa } from '@/lib/site';

export function WhatsAppFab() {
  return (
    <a
      href={wa('Olá, Dra. Samila! Vim pelo site e gostaria de uma orientação.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar pelo WhatsApp"
      className="fab-pulse fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-wine-950 shadow-[0_10px_40px_-8px_rgba(201,164,92,0.8)] transition-transform hover:scale-110"
    >
      <MessageCircle size={24} />
    </a>
  );
}
