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

### Discovery & Search
- ✅ Typeahead search with instant results
- ✅ Advanced filtering by category and license
- ✅ Collapsible filter interface
- ✅ Like/unlike datasets
- ✅ Dataset preview

### User Interface
- ✅ Responsive design
- ✅ Clean, modern UI with Shadcn components
- ✅ Real-time updates
- ✅ Loading states and error handling
- ✅ Mobile-friendly layout

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Solana Wallet Adapter
- **Storage**: Supabase Storage
- **State Management**: React Hooks + Context
- **Icons**: Lucide Icons

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

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Fill in your Supabase and other configuration details.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
datadao/
├── app/                 # Next.js app router
├── components/         # React components
│   ├── ui/            # Shadcn UI components
│   └── ...            # Custom components
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

### Dataset Likes Table
```sql
CREATE TABLE dataset_likes (
  dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE,
  wallet_address TEXT REFERENCES users(wallet_address) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (dataset_id, wallet_address)
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
