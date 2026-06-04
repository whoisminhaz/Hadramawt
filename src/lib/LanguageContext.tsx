import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ms' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    home: "Home",
    menu: "Menu",
    reservations: "Reservations",
    dashboard: "Dashboard",
    hero_title: "Authentic Yemeni Taste",
    hero_subtitle: "Experience the richest flavors of Middle Eastern cuisine right here in Kuala Lumpur.",
    order_now: "Order Now",
    book_table: "Book A Table",
    loyalty_program: "Loyalty Program",
    track_order: "Track Order",
  },
  ms: {
    home: "Utama",
    menu: "Menu",
    reservations: "Tempahan",
    dashboard: "Papan Pemuka",
    hero_title: "Cita Rasa asli Yaman",
    hero_subtitle: "Alami kekayaan perisa masakan Timur Tengah di sini, di Kuala Lumpur.",
    order_now: "Pesan Sekarang",
    book_table: "Tempah Meja",
    loyalty_program: "Program Kesetiaan",
    track_order: "Jejak Pesanan",
  },
  ar: {
    home: "الرئيسية",
    menu: "القائمة",
    reservations: "الحجوزات",
    dashboard: "لوحة القيادة",
    hero_title: "المذاق اليمني الأصيل",
    hero_subtitle: ".استمتع بأغنى النكهات من المطبخ الشرق أوسطي هنا في كوالالمبور",
    order_now: "اطلب الآن",
    book_table: "احجز طاولة",
    loyalty_program: "برنامج الولاء",
    track_order: "تتبع الطلب",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
