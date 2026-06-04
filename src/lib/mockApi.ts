// src/lib/mockApi.ts

const INITIAL_DATA = {
  menu: [
    { id: "1", name: "Chicken Mandi", description: "Traditional Yemeni rice dish with slow-cooked chicken.", price: 25.0, category: "Main Course", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=600" },
    { id: "2", name: "Lamb Kabsa", description: "Spiced basmati rice with tender lamb.", price: 35.0, category: "Main Course", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=600" },
    { id: "3", name: "Kunafa", description: "Traditional Middle Eastern sweet made with spun pastry and cheese.", price: 15.0, category: "Dessert", image: "https://images.unsplash.com/photo-1541783245831-57d6fb0936d5?auto=format&fit=crop&q=80&w=600" },
    { id: "4", name: "Mint Margarita", description: "Refreshing blend of mint, lemon, and ice.", price: 10.0, category: "Drinks", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600" },
  ],
  orders: [] as any[],
  reservations: [] as any[],
  reviews: [
    { id: "1", author: "Ahmad", rating: 5, comment: "Best Mandi in town! Highly recommend.", date: new Date().toISOString() },
    { id: "2", author: "Sarah", rating: 4, comment: "Great food, fast service.", date: new Date().toISOString() }
  ],
};

function getDB() {
  const db = localStorage.getItem('hadramawt_db');
  if (!db) {
    localStorage.setItem('hadramawt_db', JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
  return JSON.parse(db);
}

function saveDB(data: any) {
  localStorage.setItem('hadramawt_db', JSON.stringify(data));
}

// Override fetch if not on localhost
if (typeof window !== 'undefined' && 
    window.location.hostname !== 'localhost' && 
    window.location.hostname !== '127.0.0.1') {
  
  const originalFetch = window.fetch;
  
  window.fetch = async function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const urlStr = typeof input === 'string' ? input : (input instanceof URL ? input.href : input.url);
    
    // Match /api/...
    const apiPathMatch = urlStr.match(/\/api\/([a-zA-Z0-9_-]+)(?:\/([a-zA-Z0-9_-]+))?/);
    
    if (apiPathMatch) {
      const resource = apiPathMatch[1]; // menu, orders, reservations, reviews
      const id = apiPathMatch[2]; // optional ID
      const method = (init?.method || 'GET').toUpperCase();
      const db = getDB();
      
      let responseBody: any = null;
      let status = 200;
      
      if (resource === 'menu') {
        if (method === 'GET') {
          responseBody = db.menu;
        } else if (method === 'POST') {
          const body = JSON.parse(init?.body as string || '{}');
          const newItem = { ...body, id: Date.now().toString() };
          db.menu.push(newItem);
          saveDB(db);
          responseBody = newItem;
        } else if (method === 'DELETE' && id) {
          db.menu = db.menu.filter((m: any) => m.id !== id);
          saveDB(db);
          responseBody = { success: true };
        }
      } else if (resource === 'orders') {
        if (method === 'GET') {
          if (id) {
            const order = db.orders.find((o: any) => o.id === id);
            if (order) {
              responseBody = order;
            } else {
              status = 404;
              responseBody = { error: 'Not found' };
            }
          } else {
            responseBody = db.orders;
          }
        } else if (method === 'POST') {
          const body = JSON.parse(init?.body as string || '{}');
          const newOrder = {
            ...body,
            id: 'ORD' + Math.floor(Math.random() * 10000),
            status: 'Preparing',
            date: new Date().toISOString()
          };
          db.orders.push(newOrder);
          saveDB(db);
          responseBody = newOrder;
        } else if (method === 'PUT' && id) {
          const body = JSON.parse(init?.body as string || '{}');
          const index = db.orders.findIndex((o: any) => o.id === id);
          if (index !== -1) {
            db.orders[index] = { ...db.orders[index], ...body };
            saveDB(db);
            responseBody = db.orders[index];
          } else {
            status = 404;
            responseBody = { error: 'Not found' };
          }
        }
      } else if (resource === 'reservations') {
        if (method === 'GET') {
          responseBody = db.reservations;
        } else if (method === 'POST') {
          const body = JSON.parse(init?.body as string || '{}');
          const newReservation = {
            ...body,
            id: 'RES' + Math.floor(Math.random() * 10000),
            status: 'Confirmed',
            date: new Date().toISOString()
          };
          db.reservations.push(newReservation);
          saveDB(db);
          responseBody = newReservation;
        } else if (method === 'PUT' && id) {
          const body = JSON.parse(init?.body as string || '{}');
          const index = db.reservations.findIndex((r: any) => r.id === id);
          if (index !== -1) {
            db.reservations[index] = { ...db.reservations[index], ...body };
            saveDB(db);
            responseBody = db.reservations[index];
          } else {
            status = 404;
            responseBody = { error: 'Not found' };
          }
        }
      } else if (resource === 'reviews') {
        if (method === 'GET') {
          responseBody = db.reviews;
        } else if (method === 'POST') {
          const body = JSON.parse(init?.body as string || '{}');
          const newReview = { ...body, id: Date.now().toString(), date: new Date().toISOString() };
          db.reviews.push(newReview);
          saveDB(db);
          responseBody = newReview;
        } else if (method === 'DELETE' && id) {
          db.reviews = db.reviews.filter((r: any) => r.id !== id);
          saveDB(db);
          responseBody = { success: true };
        }
      }
      
      return new Response(JSON.stringify(responseBody), {
        status: status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return originalFetch(input, init);
  };
}
