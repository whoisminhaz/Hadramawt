import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useLanguage } from '../lib/LanguageContext';
import { Input, Button, Card } from '../components/ui';
import { PackageSearch, CheckCircle2, Truck, ChefHat, PackageCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function TrackOrder() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';
  
  const [orderId, setOrderId] = useState(initialId);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchOrder = async (id: string) => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        setError('Order not found. Please check your ID.');
        setOrder(null);
      }
    } catch (e) {
      setError('Wait to fetch order.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) fetchOrder(initialId);
  }, [initialId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderId);
  };

  const statusSteps = ['Received', 'Preparing', 'Out for Delivery', 'Delivered'];
  const currentStepIndex = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-serif font-bold">{t('track_order')}</h1>
        <p className="text-muted-foreground">Follow your delivery in real-time.</p>
      </div>

      <Card className="p-2 pl-4 max-w-xl mx-auto flex items-center border-primary/20 bg-primary/5">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <PackageSearch className="w-5 h-5 text-muted-foreground self-center" />
          <Input 
            className="border-none bg-transparent shadow-none focus-visible:ring-0 px-0" 
            placeholder="Enter Order ID (e.g. ORD1234)" 
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading}>Track</Button>
        </form>
      </Card>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {order && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6 md:p-8 space-y-8">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold">Order #{order.id}</h2>
                <p className="text-muted-foreground">{new Date(order.date).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {order.status}
                </span>
              </div>
            </div>

            {/* Tracking Progress */}
            <div className="relative py-8">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded-full" />
              <div 
                className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${(Math.max(0, currentStepIndex) / (statusSteps.length - 1)) * 100}%` }}
              />
              <div className="relative flex justify-between z-10 w-full">
                {[ 
                  { icon: CheckCircle2, label: 'Received' },
                  { icon: ChefHat, label: 'Preparing' },
                  { icon: Truck, label: 'Out for Delivery' },
                  { icon: PackageCheck, label: 'Delivered' }
                ].map((step, idx) => {
                  const isActive = idx <= currentStepIndex;
                  const Icon = step.icon;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 -mt-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-background transition-colors duration-500
                        ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-xs font-medium md:text-sm text-center max-w-[80px] ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-lg">Order Details</h3>
              <div className="space-y-3">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.item.name}</span>
                    <span>RM {(item.item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold pt-4 border-t">
                <span>Total</span>
                <span className="text-primary">RM {order.total.toFixed(2)}</span>
              </div>
            </div>
            
            {order.status !== 'Delivered' && (
              <div className="bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 p-4 rounded-lg flex gap-3 text-sm flex items-center">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p>We've sent a notification to your email/phone. You'll receive live push updates when the status changes.</p>
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </div>
  );
}
