# Neutral Face

A platform for uploading, managing, and labeling datasets for AI model training and RAG pipelines.

## Tech Stack

- **Frontend:** Next.js 14, Shadcn UI, Tailwind CSS, Lucide Icons
- **Backend:** Supabase (PostgreSQL, Authentication, Storage)
- **Authentication:** Solana Wallet Adapter
- **Blockchain:** Solana (Devnet for development)

## Prerequisites

Before you begin, ensure you have installed:
- Node.js 18.17 or later
- npm or yarn package manager
- A Supabase account and project
- Phantom Wallet browser extension

## Getting Started

1. **Clone the repository**

```bash
git clone <repository-url>
cd neutral-face
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Install required packages**

```bash
# Install core dependencies
npm install @supabase/supabase-js lucide-react

# Install Solana dependencies
npm install \
  @solana/web3.js \
  @solana/wallet-adapter-react \
  @solana/wallet-adapter-base \
  @solana/wallet-adapter-wallets \
  @solana/wallet-adapter-react-ui

# Install Shadcn UI and its dependencies
npm install -D @radix-ui/react-select
npm install -D @radix-ui/react-slot
npm install -D class-variance-authority
npm install -D clsx
npm install -D tailwind-merge
```

4. **Install and Configure Shadcn UI**

```bash
# Initialize Shadcn UI
npx shadcn init

# Install required components
npx shadcn add select
npx shadcn add button
npx shadcn add dialog
npx shadcn add input
npx shadcn add label
npx shadcn add textarea
npx shadcn add tooltip
npx shadcn add dropdown-menu
```

5. **Environment Setup**

Copy the `.env.local.example` file to `.env.local`:

```bash
cp .env.local.example .env.local
```

Then update the `.env.local` file with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

6. **Supabase Setup**

Create the required tables in your Supabase database:

```sql
-- Create datasets table
CREATE TABLE datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    size INT DEFAULT 0,
    category_tags TEXT[] DEFAULT '{}',
    likes INT DEFAULT 0,
    file_url TEXT,
    visibility TEXT DEFAULT 'public',
    license TEXT,
    created_by TEXT NOT NULL -- Solana wallet address
);

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add foreign key constraint to link datasets with users
ALTER TABLE datasets
ADD CONSTRAINT datasets_created_by_fkey 
FOREIGN KEY (created_by) 
REFERENCES users(wallet_address);

-- Create an index on wallet_address for faster lookups
CREATE INDEX users_wallet_address_idx ON users(wallet_address);
```

7. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── app/
│   ├── layout.tsx        # Root layout with providers
│   ├── page.tsx          # Main landing page
│   └── profile/
│       └── page.tsx      # User profile page
├── components/
│   ├── DatasetCard.tsx   # Dataset card component
│   ├── DatasetList.tsx   # Dataset listing component
│   ├── Navbar.tsx        # Navigation bar with wallet
│   ├── UserProfile.tsx   # User profile management
│   ├── WalletButton.tsx  # Wallet connect button
│   └── providers/
│       ├── ClientOnly.tsx    # Client-side rendering wrapper
│       └── WalletProvider.tsx # Solana wallet provider
├── lib/
│   └── supabase.ts       # Supabase client configuration
└── types/
    └── dataset.ts        # TypeScript interfaces
```

## Features

- Solana Wallet Authentication
- User Profile Management
  - Username and email association
  - Profile editing
- Dataset Management
  - Dataset listing with sorting options
  - Dataset cards showing metadata
  - Like functionality
  - File upload and preview
  - Dataset ownership and author display
  - Edit and delete capabilities for dataset owners
- Responsive design
- Integration with Supabase backend

## Development

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses:
- [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) for optimized fonts
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Shadcn UI](https://ui.shadcn.com/) for UI components
- [Supabase](https://supabase.com/) for backend services
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/) for blockchain integration

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Solana Documentation](https://docs.solana.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Optional: Additional environment variables for future use
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Neutral Face"
