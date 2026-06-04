import React, { useState } from 'react';
import { useLanguage } from '../lib/LanguageContext';
import { Input, Button, Card } from '../components/ui';
import { Calendar as CalendarIcon, Clock, Users, CheckCircle2 } from 'lucide-react';

export default function Reservation() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: 2,
    name: '',
    phone: '',
    specialRequests: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [resId, setResId] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      const data = await res.json();
      setResId(data.id);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center space-y-6 py-24">
        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
        <h2 className="text-3xl font-serif font-bold">Booking Confirmed!</h2>
        <p className="text-muted-foreground">Thank you, {formData.name}. Your table is reserved.</p>
        <Card className="p-6 text-left space-y-2 bg-muted/30">
          <p><strong>Reservation ID:</strong> {resId}</p>
          <p><strong>Date & Time:</strong> {formData.date} at {formData.time}</p>
          <p><strong>Guests:</strong> {formData.guests} people</p>
        </Card>
        <Button onClick={() => window.location.href = '/'}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4 pt-12 pb-8">
        <span className="text-primary font-bold tracking-widest text-sm uppercase">Secure Your Spot</span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">Reserve a Table</h1>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">Experience the finest Middle Eastern hospitality. Reserve your table online for an unforgettable dining experience.</p>
      </div>

      <Card className="p-8 md:p-12 shadow-2xl border-none bg-card/50 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2"><CalendarIcon className="w-4 h-4"/> Date</label>
              <Input type="date" required min={today} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2"><Clock className="w-4 h-4"/> Time</label>
              <Input type="time" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2"><Users className="w-4 h-4"/> Number of Guests</label>
              <Input type="number" min="1" max="20" required value={formData.guests} onChange={e => setFormData({...formData, guests: parseInt(e.target.value)})} />
            </div>
          </div>
          
          <hr className="border-border" />
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input required placeholder="Enter your name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input required placeholder="Contact number" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Special Requests (Optional)</label>
            <textarea 
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="e.g. Birthday celebration, wheelchair access..."
              value={formData.specialRequests}
              onChange={e => setFormData({...formData, specialRequests: e.target.value})}
            />
          </div>

          <Button type="submit" size="lg" className="w-full text-base">Confirm Reservation</Button>
        </form>
      </Card>
    </div>
  );
}
