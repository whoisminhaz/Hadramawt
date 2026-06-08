import { motion } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';
import { Button, Card } from '../components/ui';
import { Link } from 'react-router';
import { MapPin, Clock, Phone, Star, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Home() {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch('/api/reviews').then(r => r.json()).then(setReviews);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="space-y-0 pb-12 w-full max-w-none px-0">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center -mt-8 mx-auto w-full max-w-[100vw] overflow-hidden text-white">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1541783245831-57d6fb0936d5?auto=format&fit=crop&q=80&w=1920" 
          alt="Hadramawt Food" 
          className="absolute inset-0 w-full h-full object-cover -z-10"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 -z-10" />
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col items-center text-center space-y-6 mt-16">
          <motion.span 
            initial={{ opacity: 0, tracking: '0' }}
            animate={{ opacity: 1, tracking: '0.2em' }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-primary tracking-widest text-sm font-bold uppercase drop-shadow-md"
          >
            Kuala Lumpur, Malaysia
          </motion.span>
          <motion.h1 
            initial="hidden" animate="visible" variants={fadeIn}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold max-w-4xl leading-[1.1] drop-shadow-xl"
          >
            A Taste of True <em className="text-primary font-serif italic">Arabia</em>
          </motion.h1>
          <motion.p 
            initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.2 }}
            className="text-lg md:text-xl max-w-2xl text-white/90 drop-shadow-md font-light"
          >
            Experience premium Middle Eastern dining, authentic Yemeni spices, and unforgettable culinary moments in the heart of KL.
          </motion.p>
          <motion.div 
            initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4 pt-8 justify-center"
          >
            <a href="https://hadramawth-f58ba.web.app/order" target="_blank" rel="noreferrer">
               <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-base border-none px-8 py-6 rounded-full shadow-lg shadow-primary/30 transition-transform hover:scale-105">
                 Explore Menu
               </Button>
            </a>
            <a href="https://hadramawth-f58ba.web.app/book" target="_blank" rel="noreferrer">
               <Button variant="outline" size="lg" className="text-base bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-white px-8 py-6 rounded-full backdrop-blur-md transition-transform hover:scale-105">
                 Reserve Table
               </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section className="py-24 container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800" alt="Restaurant Interior" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-8 -right-8 w-2/3 aspect-square rounded-3xl overflow-hidden shadow-2xl border-8 border-background hidden md:block">
               <img src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=600" alt="Spices" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="space-y-8 lg:pl-12"
          >
            <div className="space-y-4">
              <span className="text-primary font-bold tracking-widest text-sm uppercase">The Experience</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">More Than Just a Meal</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Step into a world where every corner tells a story. From the rich, warm terracotta walls to the aromatic scent of slow-cooked Lamb Mandy, Restoran Hadramawt transforms every visit into a beautiful memory.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Whether you're here for a family feast, a premium dining experience, or simply to enjoy traditional Arabic tea, we offer a luxurious escape.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {['Authentic Spices', 'Premium Quality', 'Family Friendly', 'Luxurious Vibes'].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED MENU PREVIEW */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 space-y-6">
            <div className="max-w-2xl space-y-4">
              <span className="text-primary font-bold tracking-widest text-sm uppercase">Signature Offerings</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold">Curated Signatures</h2>
            </div>
            <a href="https://hadramawth-f58ba.web.app/order" target="_blank" rel="noreferrer" className="group flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors">
              View Full Menu <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Lamb Mandy', img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800', desc: 'Slow-cooked tender lamb with smoked basmati rice.' },
              { name: 'Chicken Kabsa', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800', desc: 'Richly spiced chicken served over fragrant rice.' },
              { name: 'Cheese Kunafa', img: 'https://images.unsplash.com/photo-1541783245831-57d6fb0936d5?auto=format&fit=crop&q=80&w=800', desc: 'Sweet, cheesy pastry soaked in rose syrup.' }
            ].map((item, i) => (
              <motion.div 
                key={item.name}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group relative rounded-3xl overflow-hidden shadow-lg cursor-pointer"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <h3 className="text-2xl font-serif font-bold mb-2">{item.name}</h3>
                  <p className="text-white/80 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-24 container mx-auto px-6 lg:px-12">
        <div className="text-center space-y-4 mb-16">
          <span className="text-primary font-bold tracking-widest text-sm uppercase">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold">What Our Guests Say</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.slice(0, 3).map((r: any, i: number) => (
            <motion.div 
              key={r.id || i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            >
              <Card className="p-8 h-full flex flex-col justify-between space-y-6 hover:shadow-xl transition-shadow border-none bg-secondary/20">
                <div className="flex text-accent">
                  {[...Array(5)].map((_, j) => (
                     <Star key={j} className={j < r.rating ? "fill-current" : "text-muted"} size={18} />
                  ))}
                </div>
                <p className="text-lg italic text-foreground flex-1 leading-relaxed">"{r.comment}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold font-serif text-xl">
                    {r.author[0]}
                  </div>
                  <div>
                    <h4 className="font-bold">{r.author}</h4>
                    <span className="text-sm text-muted-foreground">Verified Guest</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* VISIT / INFO */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <span className="text-primary-foreground/80 font-bold tracking-widest text-sm uppercase">Visit Us</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold">Escape Into Tradition</h2>
              
              <div className="space-y-6 pt-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-white/10 shrink-0"><MapPin className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Location</h4>
                    <p className="text-primary-foreground/80">294, Jln Ampang, Kampung Berembang<br/>50450 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-white/10 shrink-0"><Clock className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Opening Hours</h4>
                    <p className="text-primary-foreground/80">Everyday: 11:00 AM - 2:00 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-white/10 shrink-0"><Phone className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Contact</h4>
                    <p className="text-primary-foreground/80">+60 3-4256 0678</p>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-primary rounded-full px-8" onClick={() => window.open('https://maps.app.goo.gl/Ym5VCVWp2jEGHFjJ6')}>
                  Get Directions
                </Button>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden aspect-square lg:aspect-[4/3] shadow-2xl">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.7483661141386!2d101.73711909999999!3d3.1610443999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc37afdc337c67%3A0xc3191be8fcd7ed1e!2sRestoran%20Hadramawt!5e0!3m2!1sen!2smy!4v1717551065163!5m2!1sen!2smy" 
                className="absolute inset-0 w-full h-full border-0" 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Restoran Hadramawt Location"
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
