import { HashRouter as Router, Routes, Route, Link } from 'react-router';
import { LanguageProvider, useLanguage } from './lib/LanguageContext';
import { useState, useEffect } from 'react';
import { Moon, Sun, Menu as MenuIcon, X } from 'lucide-react';
import { Button } from './components/ui';

// Lazy loading or direct imports for pages
import Home from './pages/Home';
import MenuPage from './pages/Menu';
import Reservation from './pages/Reservation';
import Dashboard from './pages/Dashboard';
import TrackOrder from './pages/TrackOrder';

function Navbar() {
  const { t, language, setLanguage } = useLanguage();
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-serif font-bold text-primary flex items-center gap-3 tracking-wide">
            <img src="./assets/logo.png" alt="Logo" className="w-10 h-10 rounded-full bg-primary/10 object-cover hidden sm:block border border-primary/20" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            Hadramawt
          </Link>
          <div className="hidden md:flex gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors tracking-wide uppercase">{t('home')}</Link>
            <Link to="/menu" className="text-sm font-medium hover:text-primary transition-colors tracking-wide uppercase">{t('menu')}</Link>
            <Link to="/reservation" className="text-sm font-medium hover:text-primary transition-colors tracking-wide uppercase">{t('reservations')}</Link>
            <Link to="/track" className="text-sm font-medium hover:text-primary transition-colors tracking-wide uppercase">{t('track_order')}</Link>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
          >
            <option value="en">English</option>
            <option value="ms">Melayu</option>
            <option value="ar">العربية</option>
          </select>
          <Button variant="ghost" size="icon" onClick={() => setDark(!dark)}>
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Link to="/dashboard">
            <Button variant="outline" size="sm">{t('dashboard')}</Button>
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-2">
           <Button variant="ghost" size="icon" onClick={() => setDark(!dark)}>
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-b pb-4 px-4 flex flex-col gap-4 bg-background">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-sm font-medium">{t('home')}</Link>
          <Link to="/menu" onClick={() => setMenuOpen(false)} className="text-sm font-medium">{t('menu')}</Link>
          <Link to="/reservation" onClick={() => setMenuOpen(false)} className="text-sm font-medium">{t('reservations')}</Link>
          <Link to="/track" onClick={() => setMenuOpen(false)} className="text-sm font-medium">{t('track_order')}</Link>
          <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-sm font-medium">{t('dashboard')}</Link>
          <select 
            value={language} 
            onChange={(e) => {
              setLanguage(e.target.value as any);
              setMenuOpen(false);
            }}
            className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer border rounded-md p-1 items-start w-max"
          >
            <option value="en">English</option>
            <option value="ms">Melayu</option>
            <option value="ar">العربية</option>
          </select>
        </div>
      )}
    </nav>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen flex flex-col font-sans selection:bg-primary/20">
          <Navbar />
          <main className="flex-1 w-full mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/reservation" element={<Reservation />} />
              <Route path="/track" element={<TrackOrder />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          <footer className="bg-foreground text-background py-16 mt-0">
            <div className="container mx-auto px-6 lg:px-12 grid md:grid-cols-4 gap-12">
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-2xl font-serif font-bold text-primary">Restoran Hadramawt</h3>
                <p className="text-background/70 max-w-sm leading-relaxed">
                  A premium dining destination in Kuala Lumpur offering authentic Middle Eastern cuisine, rich Yemeni flavors, and an unforgettable atmosphere.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold tracking-widest text-sm uppercase text-primary">Explore</h4>
                <div className="flex flex-col gap-2 text-background/80">
                  <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                  <Link to="/menu" className="hover:text-primary transition-colors">Our Menu</Link>
                  <Link to="/reservation" className="hover:text-primary transition-colors">Reservations</Link>
                  <Link to="/track" className="hover:text-primary transition-colors">Track Order</Link>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold tracking-widest text-sm uppercase text-primary">Contact</h4>
                <div className="flex flex-col gap-2 text-background/80 text-sm">
                  <p>294, Jln Ampang, KL</p>
                  <p>+60 3-4256 0678</p>
                  <p>Open Daily: 11AM - 2AM</p>
                </div>
              </div>
            </div>
            <div className="container mx-auto px-6 lg:px-12 mt-12 pt-8 border-t border-background/10 text-center text-sm text-background/50 flex flex-col md:flex-row justify-between items-center gap-4">
              <span>© {new Date().getFullYear()} Restoran Hadramawt. All rights reserved.</span>
              <span>Made with ❤️ in Kuala Lumpur</span>
            </div>
          </footer>
        </div>
      </Router>
    </LanguageProvider>
  );
}
