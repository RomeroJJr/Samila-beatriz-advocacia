import { Header } from '@/components/header';
import { ScrollStage } from '@/components/scroll-stage';
import { WhatsAppFab } from '@/components/whatsapp-fab';
import { About } from '@/components/sections/about';
import { Areas } from '@/components/sections/areas';
import { Booking } from '@/components/sections/booking';
import { Faq } from '@/components/sections/faq';
import { Footer } from '@/components/sections/footer';
import { Hero } from '@/components/sections/hero';
import { Marquee } from '@/components/sections/marquee';
import { News } from '@/components/sections/news';
import { Pillars } from '@/components/sections/pillars';
import { Prepare } from '@/components/sections/prepare';
import { Process } from '@/components/sections/process';
import { Service } from '@/components/sections/service';

export default function Home() {
  return (
    <>
      <Header />
      <ScrollStage>
        <Hero />
        <Marquee />
        <About />
        <Areas />
        <Process />
        <Pillars />
        <News />
        <Service />
        <Booking />
        <Prepare />
        <Faq />
        <Footer />
      </ScrollStage>
      <WhatsAppFab />
    </>
  );
}
