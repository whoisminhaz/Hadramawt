import { motion } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';
import { Button, Card } from '../components/ui';
import { Link } from 'react-router';
import { MapPin, Clock, Phone, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Home() {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch('/api/reviews').then(r => r.json()).then(setReviews);
  }, []);

  return (
    <div className="space-y-24 pb-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden min-h-[60vh] flex items-center bg-black/40 text-white">
        <img 
          src="https://images.unsplash.com/photo-1541783245831-57d6fb0936d5?auto=format&fit=crop&q=80&w=1600" 
          alt="Hadramawt Food" 
          className="absolute inset-0 w-full h-full object-cover -z-10 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent -z-10" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10 space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
            className="text-5xl md:text-7xl font-serif font-bold max-w-2xl leading-tight"
          >
            {t('hero_title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-lg md:text-xl max-w-xl text-white/90"
          >
            {t('hero_subtitle')}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <Link to="/menu">
               <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-base border-none">
                 {t('order_now')}
               </Button>
            </Link>
            <Link to="/reservation">
               <Button variant="outline" size="lg" className="text-base bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-white">
                 {t('book_table')}
               </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Info Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <Card className="p-6 flex flex-col items-center text-center space-y-4">
          <div className="p-3 rounded-full bg-primary/10 text-primary"><MapPin className="w-6 h-6" /></div>
          <h3 className="font-semibold text-lg">Location</h3>
          <p className="text-muted-foreground text-sm">294, Jln Ampang, Kampung Berembang, 50450 Kuala Lumpur, KL</p>
        </Card>
        <Card className="p-6 flex flex-col items-center text-center space-y-4">
          <div className="p-3 rounded-full bg-primary/10 text-primary"><Clock className="w-6 h-6" /></div>
          <h3 className="font-semibold text-lg">Opening Hours</h3>
          <p className="text-muted-foreground text-sm">Everyday: 11:00 AM - 2:00 AM</p>
        </Card>
        <Card className="p-6 flex flex-col items-center text-center space-y-4">
          <div className="p-3 rounded-full bg-primary/10 text-primary"><Phone className="w-6 h-6" /></div>
          <h3 className="font-semibold text-lg">Contact</h3>
          <p className="text-muted-foreground text-sm">+60 3-4256 0678</p>
        </Card>
      </section>

      {/* Map Mockup */}
      <section className="space-y-6 rounded-2xl overflow-hidden border p-2 bg-card">
        <div className="w-full aspect-video md:aspect-[21/9] bg-muted rounded-xl relative flex items-center justify-center overflow-hidden group cursor-pointer" onClick={() => window.open('https://maps.app.goo.gl/Ym5VCVWp2jEGHFjJ6')}>
           <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" alt="Map View" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="bg-background/90 backdrop-blur p-4 rounded-xl shadow-lg flex items-center gap-4 hover:scale-105 transition-transform">
               <MapPin className="text-primary w-8 h-8" />
               <div className="text-left">
                 <p className="font-bold">Restoran Hadramawt</p>
                 <p className="text-sm text-muted-foreground">Open in Google Maps</p>
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-serif font-bold">Traditional Atmosphere</h2>
          <p className="text-muted-foreground">Immerse yourself in authentic Middle Eastern dining.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600" alt="Atmosphere 1" className="rounded-xl object-cover aspect-square hover:scale-[1.02] transition-transform" />
          <img src="https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=600" alt="Atmosphere 2" className="rounded-xl object-cover aspect-square hover:scale-[1.02] transition-transform" />
          <img src="https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=600" alt="Food 1" className="rounded-xl object-cover aspect-square hover:scale-[1.02] transition-transform" />
          <img src="https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&q=80&w=600" alt="Atmosphere 3" className="rounded-xl object-cover aspect-square hover:scale-[1.02] transition-transform" />
        </div>
      </section>

      {/* Reviews */}
      <section className="space-y-8 bg-muted/30 p-8 rounded-3xl">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-serif font-bold">Customer Reviews</h2>
          <p className="text-muted-foreground">See what others are saying about us.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r: any) => (
            <Card key={r.id} className="p-6 space-y-4">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                   <Star key={i} className={i < r.rating ? "fill-current" : "text-muted"} size={16} />
                ))}
              </div>
              <p className="italic text-muted-foreground">"{r.comment}"</p>
              <div className="font-semibold">- {r.author}</div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
