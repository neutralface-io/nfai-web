# DataDAO - AI Dataset Crowdsourcing Platform

A decentralized platform for sharing and discovering AI training datasets, built with Next.js, Supabase, and Solana.

## Features

### Authentication
- ✅ Solana wallet-based authentication
- ✅ User profiles with customizable usernames
- ✅ Real-time profile updates

### Dataset Management
- ✅ Create and upload datasets
- ✅ Edit dataset metadata
- ✅ Delete datasets (owner only)
- ✅ File upload support
- ✅ Dataset ownership verification
- ✅ Like/unlike datasets

### Discovery & Search
- ✅ Typeahead search with instant results
- ✅ Advanced filtering by category and license
- ✅ Collapsible filter interface
- ✅ Dataset preview
- ✅ Responsive grid layout

### Collections
- ✅ Create personal collections
- ✅ Add/remove datasets to collections
- ✅ Share collections with other users
- ✅ Public/private collection visibility
- ✅ Delete collections (owner only)
- ✅ Collection management interface
- ✅ Share collections via wallet address

### User Interface
- ✅ Responsive design
- ✅ Clean, modern UI with Shadcn components
- ✅ Real-time updates
- ✅ Loading states and error handling
- ✅ Mobile-friendly layout
- ✅ Navigation with active states
- ✅ Toast notifications
- ✅ Confirmation dialogs

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Solana Wallet Adapter
- **Storage**: Supabase Storage
- **State Management**: React Hooks + Context
- **Icons**: Lucide Icons
- **Notifications**: Sonner

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/datadao.git
cd datadao
```

2. Install dependencies:
```bash
npm install
```

3. Install Shadcn UI components:
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add alert-dialog
npx shadcn-ui@latest add sonner
```

4. Set up environment variables:
```bash
cp .env.example .env.local
```
Fill in your Supabase and other configuration details.

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
datadao/
├── app/                 # Next.js app router
├── components/         # React components
│   ├── ui/            # Shadcn UI components
│   └── collections/   # Collection components
├── lib/               # Utility functions
├── public/            # Static assets
└── types/             # TypeScript types
```

## Key Components

- `DatasetList`: Main dataset listing with filters
- `DatasetCard`: Individual dataset display
- `SearchBar`: Typeahead search component
- `WalletButton`: Solana wallet integration
- `DatasetFilters`: Advanced filtering interface
- `CollectionsList`: Collections management
- `CollectionCard`: Individual collection display
- `CreateCollectionModal`: Collection creation interface
- `ShareCollectionDialog`: Collection sharing dialog

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  wallet_address TEXT PRIMARY KEY,
  username TEXT UNIQUE,
  email TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Datasets Table
```sql
CREATE TABLE datasets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_by TEXT REFERENCES users(wallet_address),
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  size INTEGER DEFAULT 0,
  category_tags TEXT[],
  likes INTEGER DEFAULT 0,
  file_url TEXT,
  visibility TEXT DEFAULT 'public',
  license TEXT
);
```

### Collections Tables
```sql
-- Collections table
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_by TEXT REFERENCES users(wallet_address),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_public BOOLEAN DEFAULT false
);

-- Collection items (datasets in collections)
CREATE TABLE collection_items (
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (collection_id, dataset_id)
);

-- Collection sharing
CREATE TABLE collection_shares (
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  shared_with TEXT REFERENCES users(wallet_address) ON DELETE CASCADE,
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (collection_id, shared_with)
);
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
