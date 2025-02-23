# Dataset Marketplace

A decentralized marketplace for datasets built on Solana, allowing users to share, discover, and manage datasets with built-in collection organization.

## Features

### Dataset Management
- Upload and share datasets
- Set visibility (public/private)
- Add descriptions and metadata
- Categorize with tags
- Track dataset metrics (likes, collections)
- File management and downloads

### Collection System
- Create personal collections
- Add/remove datasets to collections
- View collection statistics
- Edit collection details inline
- Track dataset presence across collections
- See personal vs. total collection counts

### Social Features
- Like datasets
- Follow creators
- Share collections
- Real-time updates
- User profiles

### User Interface
- Clean, modern design
- Responsive layout
- Inline editing
- Tooltips and helpful information
- Real-time feedback
- Optimistic updates

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Backend**: Supabase
- **Blockchain**: Solana Web3.js
- **Authentication**: Solana Wallet Adapter

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dataset-marketplace.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

## Database Schema

### Datasets
- id: uuid
- name: string
- description: string
- visibility: string
- category_tags: string[]
- license: string
- created_by: string (wallet address)
- upload_date: timestamp
- size: number
- likes: number
- collection_count: number
- file_url: string?

### Collections
- id: uuid
- name: string
- description: string
- created_by: string (wallet address)
- created_at: timestamp

### Collection Items
- collection_id: uuid
- dataset_id: uuid

### Users
- wallet_address: string
- username: string?
- email: string?
- created_at: timestamp
- updated_at: timestamp

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
