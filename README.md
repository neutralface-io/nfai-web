# Neutral Face

A platform for uploading, managing, and labeling datasets for AI model training and RAG pipelines.

## Tech Stack

- **Frontend:** Next.js 14, Shadcn UI, Tailwind CSS, Lucide Icons
- **Backend:** Supabase (PostgreSQL, Authentication, Storage)

## Prerequisites

Before you begin, ensure you have installed:
- Node.js 18.17 or later
- npm or yarn package manager
- A Supabase account and project

## Getting Started

1. **Clone the repository**

```bash
git clone <repository-url>
cd ai-data-crowdsourcing
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

# When prompted, select:
# - Would you like to use TypeScript? Yes
# - Which style would you like to use? Default
# - Which color would you like to use as base color? Slate
# - Where is your global CSS file? app/globals.css
# - Do you want to use CSS variables? Yes
# - Where is your tailwind.config.js located? tailwind.config.js
# - Configure the import alias for components? @/components
# - Configure the import alias for utils? @/lib/utils

# Install required components
npx shadcn add select
npx shadcn add button
npx shadcn add dialog
npx shadcn add input
npx shadcn add label
npx shadcn add textarea
```

5. **Environment Setup**

Copy the `.env.local.example` file to `.env.local`:

```bash
cp .env.local.example .env.local
```

Then update the `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under the API section.

6. **Supabase Setup**

Create the following table in your Supabase database:

```sql
CREATE TABLE datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    upload_date TIMESTAMP DEFAULT now(),
    size INT,
    category_tags TEXT[],
    likes INT DEFAULT 0,
    file_url TEXT
);
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
│   └── page.tsx           # Main landing page
├── components/
│   ├── DatasetCard.tsx    # Dataset card component
│   └── DatasetList.tsx    # Dataset listing component
├── lib/
│   └── supabase.ts        # Supabase client configuration
└── types/
    └── dataset.ts         # TypeScript interfaces
```

## Features

- Dataset listing with sorting options
- Dataset cards showing metadata
- Like functionality
- Responsive design
- Integration with Supabase backend

## Development

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses:
- [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) for optimized fonts
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Shadcn UI](https://ui.shadcn.com/) for UI components
- [Supabase](https://supabase.com/) for backend services

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Optional: Additional environment variables for future use
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Neutral Face"
