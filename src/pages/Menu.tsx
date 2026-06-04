import { useState, useEffect } from 'react';
import { useLanguage } from '../lib/LanguageContext';
import { Input, Button, Card } from '../components/ui';
import { Search, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function MenuPage() {
  const { t } = useLanguage();
  const [menu, setMenu] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState<{item: any, quantity: number}[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/menu').then(r => r.json()).then(setMenu);
  }, []);

  const categories = ['All', ...Array.from(new Set(menu.map(m => m.category)))];

  const filteredMenu = menu.filter(m => 
    (category === 'All' || m.category === category) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) || m.description.toLowerCase().includes(search.toLowerCase()))
  );

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) {
        return prev.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(c => {
      if (c.item.id === id) {
        const newQ = c.quantity + delta;
        return newQ > 0 ? { ...c, quantity: newQ } : c;
      }
      return c;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(c => c.item.id !== id));
  };

  const cartTotal = cart.reduce((acc, c) => acc + (c.item.price * c.quantity), 0);

  const placeOrder = async () => {
    if (cart.length === 0) return;
    const orderData = {
      items: cart,
      total: cartTotal,
      customerName: "Guest User", // Just mocking a checkout flow
      customerPhone: "+60 12-345 6789"
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    
    if (res.ok) {
      const order = await res.json();
      setCart([]);
      navigate(`/track?id=${order.id}`);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Menu Area */}
      <div className="flex-1 space-y-8">
        <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
          <div className="space-y-2">
            <span className="text-primary font-bold tracking-widest text-sm uppercase">Our Menu</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">Culinary Traditions</h1>
            <p className="text-muted-foreground text-lg">Discover our authentic, premium dishes crafted with rich Yemeni spices.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search..." 
                className="pl-9 w-full sm:w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMenu.map(item => (
            <Card key={item.id} className="overflow-hidden flex flex-col group">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-serif font-bold text-xl leading-tight">{item.name}</h3>
                  <span className="font-bold text-primary shrink-0 text-lg">RM {item.price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6 flex-1 leading-relaxed">{item.description}</p>
                <Button className="w-full mt-auto rounded-full hover:scale-105 transition-transform" onClick={() => addToCart(item)}>
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
          {filteredMenu.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No items found matching your filters.
            </div>
          )}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-full lg:w-96 shrink-0 border-t lg:border-t-0 lg:border-l pt-8 lg:pt-0 lg:pl-8 flex flex-col h-[calc(100vh-8rem)] sticky top-24">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" /> Your Order
        </h2>
        
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {cart.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Your cart is empty.</p>
          ) : (
            cart.map(c => (
              <div key={c.item.id} className="flex gap-3 justify-between items-start p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{c.item.name}</h4>
                  <div className="font-bold text-primary text-sm">RM {(c.item.price * c.quantity).toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-2 bg-background border rounded-md">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(c.item.id, -1)}><Minus className="w-3 h-3" /></Button>
                  <span className="text-sm font-medium w-4 text-center">{c.quantity}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(c.item.id, 1)}><Plus className="w-3 h-3" /></Button>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive h-7 w-7 shrink-0 hover:bg-destructive/10" onClick={() => removeFromCart(c.item.id)}>
                   <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        <div className="pt-6 border-t mt-4 space-y-4 bg-background">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">RM {cartTotal.toFixed(2)}</span>
          </div>
          <Button className="w-full" size="lg" disabled={cart.length === 0} onClick={placeOrder}>
            Checkout & Pay
          </Button>
          <p className="text-xs text-center text-muted-foreground">Secure payment gateways will be processed on the next screen.</p>
        </div>
      </div>
    </div>
  );
}
