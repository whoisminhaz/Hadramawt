import React, { useState, useEffect } from 'react';
import { useLanguage } from '../lib/LanguageContext';
import { Card, Button, Input } from '../components/ui';
import { Lock, LogOut, Package, CalendarDays, UtensilsCrossed, TrendingUp, Check, X, MessageSquare, Trash2, Edit2, Plus } from 'lucide-react';

export default function Dashboard() {
  const { t } = useLanguage();
  const [auth, setAuth] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState<any>({ rev: 0, ordersCount: 0, resCount: 0 });
  const [data, setData] = useState<any>({ orders: [], reservations: [], menu: [], reviews: [] });
  
  const [editingMenuItem, setEditingMenuItem] = useState<any>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') setAuth(true);
    else alert('Invalid credentials');
  };

  const fetchData = async () => {
    const [oRes, rRes, mRes, revRes] = await Promise.all([
      fetch('/api/orders'), fetch('/api/reservations'), fetch('/api/menu'), fetch('/api/reviews')
    ]);
    const orders = await oRes.json();
    const reservations = await rRes.json();
    const menu = await mRes.json();
    const reviews = await revRes.json();
    setData({ orders, reservations, menu, reviews });
    
    setMetrics({
      rev: orders.reduce((sum: number, o: any) => sum + o.total, 0),
      ordersCount: orders.length,
      resCount: reservations.length
    });
  };

  useEffect(() => {
    if (auth) fetchData();
  }, [auth]);

  const updateOrderStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  const updateResStatus = async (id: string, status: string) => {
    await fetch(`/api/reservations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  const deleteReview = async (id: string) => {
    await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    fetchData();
  };
  
  const saveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const route = '/api/menu'; // Simplistic approach: add newly, or if editing just re-add in this mock. 
    // In actual implementation, we'd have PUT /api/menu/:id
    if (!editingMenuItem.id) {
       await fetch(route, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(editingMenuItem)
       });
    } else {
       // Mocking Delete + Add for PUT
       await fetch(`/api/menu/${editingMenuItem.id}`, { method: 'DELETE' });
       await fetch(route, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(editingMenuItem)
       });
    }
    setEditingMenuItem(null);
    fetchData();
  };
  
  const deleteMenuItem = async (id: string) => {
    await fetch(`/api/menu/${id}`, { method: 'DELETE' });
    fetchData();
  };

  if (!auth) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-sm p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-serif font-bold">Owner Access</h1>
            <p className="text-sm text-muted-foreground">Please sign in to continue.</p>
          </div>
          <form className="space-y-4" onSubmit={handleLogin}>
             <Input placeholder="Username (admin)" value={username} onChange={e => setUsername(e.target.value)} required />
             <Input type="password" placeholder="Password (admin)" value={password} onChange={e => setPassword(e.target.value)} required />
             <Button className="w-full">Sign In</Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <div className="w-full lg:w-64 space-y-2 lg:border-r lg:pr-6 shrink-0 h-max sticky top-24">
        <h2 className="px-4 text-sm font-semibold text-muted-foreground tracking-wider uppercase mb-4">Management</h2>
        <Button variant={activeTab === 'overview' ? 'default' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('overview')}><TrendingUp className="w-4 h-4" /> Overview</Button>
        <Button variant={activeTab === 'orders' ? 'default' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('orders')}><Package className="w-4 h-4" /> Live Orders</Button>
        <Button variant={activeTab === 'reservations' ? 'default' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('reservations')}><CalendarDays className="w-4 h-4" /> Reservations</Button>
        <Button variant={activeTab === 'menu' ? 'default' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('menu')}><UtensilsCrossed className="w-4 h-4" /> Edit Menu</Button>
        <Button variant={activeTab === 'reviews' ? 'default' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('reviews')}><MessageSquare className="w-4 h-4" /> Reviews & Comms</Button>
        <div className="pt-8 px-4">
          <Button variant="outline" className="w-full gap-2 text-destructive hover:bg-destructive/10 border-destructive/20 hover:text-destructive" onClick={() => setAuth(false)}>
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        
        {activeTab === 'overview' && (
          <div className="space-y-6">
             <h2 className="text-2xl font-serif font-bold">Today's Overview</h2>
             <div className="grid md:grid-cols-3 gap-6">
               <Card className="p-6 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold">RM {metrics.rev.toFixed(2)}</p>
               </Card>
               <Card className="p-6 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Active Orders</p>
                  <p className="text-3xl font-bold">{metrics.ordersCount}</p>
               </Card>
               <Card className="p-6 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Reservations</p>
                  <p className="text-3xl font-bold">{metrics.resCount}</p>
               </Card>
             </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
             <h2 className="text-2xl font-serif font-bold">Live Orders Tracking</h2>
             <div className="space-y-4">
               {data.orders.map((o: any) => (
                 <Card key={o.id} className="p-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
                   <div>
                     <h3 className="font-bold">{o.id} <span className="text-muted-foreground font-normal text-sm ml-2">{new Date(o.date).toLocaleTimeString()}</span></h3>
                     <p className="text-sm text-muted-foreground">{o.items.length} items • RM {o.total.toFixed(2)}</p>
                     <p className="font-medium mt-1">Status: <span className="text-primary">{o.status}</span></p>
                   </div>
                   <div className="flex gap-2">
                     <select 
                       value={o.status} 
                       onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                       className="border rounded px-2 py-1 text-sm bg-transparent"
                     >
                       <option value="Received">Received</option>
                       <option value="Preparing">Preparing</option>
                       <option value="Out for Delivery">Out for Delivery</option>
                       <option value="Delivered">Delivered</option>
                       <option value="Cancelled">Cancelled</option>
                     </select>
                   </div>
                 </Card>
               ))}
               {data.orders.length === 0 && <p className="text-muted-foreground">No active orders right now.</p>}
             </div>
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="space-y-6">
             <h2 className="text-2xl font-serif font-bold">Table Reservations</h2>
             <div className="space-y-4">
               {data.reservations.map((r: any) => (
                 <Card key={r.id} className="p-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
                   <div>
                     <h3 className="font-bold">{r.name} <span className="text-muted-foreground font-normal text-sm ml-2">{r.phone}</span></h3>
                     <p className="text-sm">Date: {r.date} • Time: {r.time} • Guests: {r.guests}</p>
                     {r.specialRequests && <p className="text-sm text-amber-600 mt-1">Note: {r.specialRequests}</p>}
                     <p className="font-medium mt-1">Status: <span className={r.status === 'Cancelled' ? 'text-destructive' : 'text-primary'}>{r.status}</span></p>
                   </div>
                   <div className="flex gap-2 shrink-0">
                     <Button variant="outline" size="sm" onClick={() => updateResStatus(r.id, 'Confirmed')}><Check className="w-4 h-4 mr-1"/> Confirm</Button>
                     <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 border-destructive/20" onClick={() => updateResStatus(r.id, 'Cancelled')}><X className="w-4 h-4 mr-1"/> Cancel</Button>
                   </div>
                 </Card>
               ))}
               {data.reservations.length === 0 && <p className="text-muted-foreground">No reservations matching.</p>}
             </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
               <h2 className="text-2xl font-serif font-bold">Dynamic Menu Editor</h2>
               <Button onClick={() => setEditingMenuItem({ name:'', description:'', price:0, category:'Main', image:'' })}><Plus className="w-4 h-4 mr-2" /> Add Item</Button>
             </div>
             
             {editingMenuItem && (
                <Card className="p-6 border-primary/20 bg-primary/5">
                  <h3 className="font-bold mb-4">{editingMenuItem.id ? 'Edit Item' : 'New Item'}</h3>
                  <form onSubmit={saveMenuItem} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input placeholder="Item Name" value={editingMenuItem.name} onChange={e => setEditingMenuItem({...editingMenuItem, name: e.target.value})} required/>
                      <Input type="number" step="0.01" placeholder="Price (RM)" value={editingMenuItem.price} onChange={e => setEditingMenuItem({...editingMenuItem, price: parseFloat(e.target.value)})} required/>
                      <Input placeholder="Category" value={editingMenuItem.category} onChange={e => setEditingMenuItem({...editingMenuItem, category: e.target.value})} required/>
                      <Input placeholder="Image URL" value={editingMenuItem.image} onChange={e => setEditingMenuItem({...editingMenuItem, image: e.target.value})} required/>
                    </div>
                    <Input placeholder="Description" value={editingMenuItem.description} onChange={e => setEditingMenuItem({...editingMenuItem, description: e.target.value})} />
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" type="button" onClick={() => setEditingMenuItem(null)}>Cancel</Button>
                      <Button type="submit">Save Selection</Button>
                    </div>
                  </form>
                </Card>
             )}

             <div className="grid gap-4">
               {data.menu.map((m: any) => (
                 <Card key={m.id} className="p-4 flex gap-4 items-center">
                   <img src={m.image} alt={m.name} className="w-16 h-16 rounded object-cover" />
                   <div className="flex-1">
                     <h4 className="font-bold">{m.name}</h4>
                     <p className="text-sm text-muted-foreground">{m.category} • RM {m.price}</p>
                   </div>
                   <div className="flex gap-2">
                     <Button variant="outline" size="icon" onClick={() => setEditingMenuItem(m)}><Edit2 className="w-4 h-4"/></Button>
                     <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => deleteMenuItem(m.id)}><Trash2 className="w-4 h-4"/></Button>
                   </div>
                 </Card>
               ))}
             </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
             <h2 className="text-2xl font-serif font-bold">Customer Reviews Management</h2>
             <div className="space-y-4">
               {data.reviews.map((r: any) => (
                 <Card key={r.id} className="p-4 flex justify-between gap-4">
                   <div>
                     <p className="font-bold">{r.author} <span className="text-amber-500 ml-2">★ {r.rating}</span></p>
                     <p className="italic text-muted-foreground mt-1">"{r.comment}"</p>
                     <p className="text-xs text-muted-foreground mt-2">{new Date(r.date).toLocaleString()}</p>
                   </div>
                   <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => deleteReview(r.id)}><Trash2 className="w-4 h-4" /></Button>
                 </Card>
               ))}
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
