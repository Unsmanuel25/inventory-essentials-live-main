
# Live Essentials

App web per la gestione del magazzino di prodotti cosmetici.  
Realizzata in React con Shadcn/UI, Supabase e deploy su Netlify.

## 🛠️ Tech Stack
• React 18 + TypeScript
• Shadcn/UI + Tailwind CSS
• React Router DOM
• Supabase (PostgreSQL + Auth)
• Netlify (Hosting)

## 🔐 Ruoli Utente
• **Admin**: accesso completo a tutte le funzionalità
• **Utente**: visualizzazione e operazioni limitate (carico/scarico)

## 📦 Funzionalità Principali

### Dashboard
• Alert visivi per prodotti sotto soglia di magazzino
• Lista movimenti recenti con icone rappresentative
• Statistiche rapide: prodotti attivi, articoli in arrivo, assemblati oggi
• Pulsanti azione rapida per "Nuovo prodotto" e "Nuovo carico"

### Inventario
• Tabella prodotti completa con filtri avanzati
• Campi: Nome, SKU, Unità misura, Giacenza, In arrivo, Fornitore
• Badge colorati per stato scorte (verde/giallo/rosso)
• Filtri per nome, codice e fornitore

### Creazione Prodotto
• Form completo per anagrafica prodotto
• Campi: Nome, SKU, Descrizione, Prezzi, Fornitore, Posizione, Quantità iniziale
• Validazione dati e interfaccia intuitiva

### Distinta Base
• Composizione prodotti finiti da materie prime
• Esempio: Shampoo 300ml = bottiglia + tappo + etichetta + confezione + 300ml da tanica
• Verifica automatica disponibilità materiali
• Scalatura automatica giacenze al completamento

### Carico/Scarico
• Registrazione carichi (arrivi da fornitori)
• Registrazione scarichi (vendite, consumi)
• Aggiornamento automatico giacenze
• Storico cronologico movimenti con note

## 🎨 Design System

### Colori
• **Sidebar**: Blu navy (#1e293b)
• **Accenti**: Verde menta (#10b981), Azzurro (#06b6d4), Rosso tenue (#ef4444)
• **Background**: Bianco (#ffffff), Grigio chiaro (#f8fafc)
• **Font**: Inter (sans-serif)

### Componenti
• Layout responsive e moderno
• Badge colorati per status
• Card components per sezioni
• Tabelle filtrabili
• Form validati
• Alert e notifiche

## 🚀 Installazione e Setup

```bash
# Clone del repository
git clone <repository-url>
cd live-essentials

# Installazione dipendenze
npm install

# Avvio ambiente di sviluppo
npm run dev

# Build per produzione
npm run build
```

## 📋 Configurazione Supabase

1. Creare progetto su [Supabase](https://supabase.com)
2. Configurare tabelle database:
   - `products` (prodotti)
   - `movements` (movimenti magazzino)
   - `bom_items` (distinta base)
   - `users` (utenti con ruoli)
3. Abilitare Row Level Security (RLS)
4. Configurare autenticazione email/password
5. Aggiungere variabili ambiente

## 🔧 Variabili Ambiente

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 📊 Schema Database

### Tabella `products`
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  sku VARCHAR UNIQUE NOT NULL,
  description TEXT,
  production_price DECIMAL(10,2),
  sale_price DECIMAL(10,2),
  supplier VARCHAR,
  location VARCHAR,
  current_stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  unit VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabella `movements`
```sql
CREATE TABLE movements (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  type VARCHAR CHECK (type IN ('carico', 'scarico', 'assemblaggio')),
  quantity INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);
```

## 🚀 Deploy su Netlify

1. Connetti repository GitHub a Netlify
2. Configura build command: `npm run build`
3. Imposta publish directory: `dist`
4. Aggiungi variabili ambiente Supabase
5. Deploy automatico ad ogni push

## 👥 Team

Sviluppato con ❤️ da **Imma**  
*Manuel ti amo* 💕

## 📝 Licenza

Questo progetto è sviluppato per uso interno aziendale.

---

## 🔄 Roadmap Funzionalità Future

- [ ] Dashboard analytics avanzate
- [ ] Export/Import dati Excel
- [ ] Notifiche email automatiche
- [ ] App mobile companion
- [ ] Integrazione sistemi ERP
- [ ] Gestione multi-magazzino
- [ ] Barcode scanning
- [ ] Reportistica avanzata
