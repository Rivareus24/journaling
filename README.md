# Journaling

App di journaling personale — una pagina al giorno.

## Panoramica

Applicazione web minimalista per tenere un diario digitale. Ogni giorno ha una pagina dedicata con editor di testo e tracciamento dell'umore. Il salvataggio è automatico.

## Funzionalità

- **Una pagina al giorno** — navigazione tra date con tasto freccia o archivio
- **Autosave** — salvataggio automatico 800ms dopo ogni modifica, con retry automatico ogni 30s in caso di errore
- **Mood tracker** — quattro stati: bad / low / good / great
- **Ricerca full-text** — ricerca fuzzy lato client su tutti gli entries (Fuse.js)
- **Archivio** — drawer laterale con storico entries
- **Autenticazione** — accesso tramite Google OAuth, sessione gestita da Supabase Auth

## Stack tecnico

| Componente | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Linguaggio | TypeScript |
| Database | Supabase (PostgreSQL) |
| Styling | Tailwind CSS |
| Animazioni | Framer Motion |
| Ricerca | Fuse.js (client-side) |
| Test | Vitest + React Testing Library |
| Deploy | Vercel |

## Architettura

```
app/
├── page.tsx              # Vista principale (client component)
├── login/
│   └── page.tsx          # UI di login (Google OAuth)
├── auth/
│   └── callback/
│       └── route.ts      # OAuth callback → scambio codice/sessione
├── layout.tsx
components/
├── DiaryPage.tsx         # Editor per singolo giorno
├── MoodPicker.tsx        # Selezione umore
├── SearchOverlay.tsx     # Overlay ricerca
├── ArchiveDrawer.tsx     # Drawer archivio
└── Footer.tsx            # Sign-out + Buy Me a Coffee
hooks/
├── useAutosave.ts        # Autosave con debounce e retry
├── useKeyboardNav.ts     # Navigazione da tastiera
└── useIsMobile.ts
lib/
├── supabase.ts           # Browser client (@supabase/ssr)
├── entries.ts            # Operazioni DB (get, upsert, search)
└── types.ts              # Tipi TypeScript (Entry, Mood)
middleware.ts             # Auth guard (verifica sessione Supabase)
```

### Flusso dati

1. Il middleware verifica la sessione Supabase su ogni richiesta
2. I componenti leggono/scrivono su Supabase via JS client (RLS filtra automaticamente per utente)
3. `useAutosave` debounce le modifiche e chiama `upsertEntry`
4. La ricerca carica tutti gli entries in memoria e usa Fuse.js

## Database

Schema Supabase (`docs/supabase-schema.sql`):

```sql
create table entries (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) not null,
  date       date not null,
  body       text not null default '',
  mood       text check (mood in ('bad', 'low', 'good', 'great')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint entries_date_user_id_key unique (date, user_id)
);

alter table entries enable row level security;

create policy "user owns their entries"
  on entries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

## Variabili d'ambiente

| Variabile | Descrizione |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del progetto Supabase (Settings → API) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chiave anonima Supabase (Settings → API) |

## Setup Google OAuth

1. Crea un progetto su [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services → Credentials → Create OAuth 2.0 Client ID (Web application)
3. Authorized redirect URI: `https://<tuo-progetto>.supabase.co/auth/v1/callback`
4. Dashboard Supabase → Authentication → Providers → Google: abilita e incolla le credenziali
5. Dashboard Supabase → Authentication → URL Configuration: aggiungi ai Redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://tua-app.vercel.app/auth/callback`

## Setup locale

```bash
git clone <repo-url> && cd journaling
npm install
cp .env.local.example .env.local
# Modifica .env.local con NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
# Esegui docs/supabase-schema.sql su Supabase → SQL Editor
npm run dev
```

## Deploy su Vercel

```bash
# Via GitHub (consigliato)
# 1. Push su GitHub
# 2. Importa il progetto su vercel.com
# 3. Imposta le variabili d'ambiente nel dashboard Vercel
# 4. Deploy automatico ad ogni push su main
```

Il CI/CD è configurato in `.github/workflows/deploy.yml`: ogni push su `main` triggera build e deploy su Vercel.

## Autenticazione

Login tramite Google OAuth. Supabase gestisce la sessione via cookie. Il middleware
verifica la sessione su ogni richiesta e reindirizza a `/login` se assente.

## Comandi disponibili

```bash
npm run dev        # Server di sviluppo (http://localhost:3000)
npm run build      # Build di produzione
npm run start      # Avvia build di produzione
npm run lint       # ESLint
npm run test       # Test (Vitest, single run)
npm run test:watch # Test in modalità watch
```
