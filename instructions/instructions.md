# AI Data Crowdsourcing Platform - Product Design Document

## 1. Overview
The AI Data Crowdsourcing Platform enables users to upload, manage, and label datasets for fine-tuning AI models or as part of retrieval-augmented generation (RAG) pipelines. The platform provides an intuitive interface for dataset discovery, contribution, and interaction.

## 2. Technology Stack
- **Frontend:** Next.js 14, Shadcn, Tailwind CSS, Lucide Icons
- **Backend:** Supabase (PostgreSQL, Authentication, Storage)
- **Authentication:** Solana Wallet Adapter
- **Hosting:** Vercel (for frontend), Supabase (for backend & database)
- **Version Control:** GitHub

---

## 3. Core Features & Requirements

### 3.1 User Authentication with Solana Wallet
#### Requirements:
- Enable user authentication via Solana-compatible wallets (e.g., Phantom)
- Use the [Solana Wallet Adapter](https://solana.com/developers/guides/wallets/add-solana-wallet-adapter-to-nextjs) for integration
- Securely store user session information
- Ensure users can connect/disconnect their wallets
- Display connected wallet address in the top right corner of the page
- Allow users to assign a username and email to their account
- Store user details (wallet address, username, email) in the database

#### Implementation Plan:
1. **Install Dependencies:**
   ```sh
   npm install @solana/wallet-adapter-react @solana/wallet-adapter-wallets @solana/wallet-adapter-react-ui
   ```

2. **Initialize Wallet Adapter in Next.js:**
   ```javascript
   import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
   import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
   import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
   import { clusterApiUrl } from '@solana/web3.js';
   
   const wallets = [new PhantomWalletAdapter()];
   
   function MyApp({ Component, pageProps }) {
       return (
           <ConnectionProvider endpoint={clusterApiUrl('devnet')}>
               <WalletProvider wallets={wallets} autoConnect>
                   <WalletModalProvider>
                       <Component {...pageProps} />
                   </WalletModalProvider>
               </WalletProvider>
           </ConnectionProvider>
       );
   }
   
   export default MyApp;
   ```

3. **Connect & Disconnect Wallet in UI:**
   ```javascript
   import { useWallet } from '@solana/wallet-adapter-react';
   
   function ConnectButton() {
       const { connect, disconnect, connected, publicKey } = useWallet();
       
       return (
           <div>
               {connected ? (
                   <div>
                       <span>{publicKey?.toBase58()}</span>
                       <button onClick={disconnect}>Disconnect</button>
                   </div>
               ) : (
                   <button onClick={connect}>Connect Wallet</button>
               )}
           </div>
       );
   }
   
   export default ConnectButton;
   ```

### 3.2 Dataset Listing
#### Requirements:
- Fetch dataset list from Supabase
- Display datasets as cards containing:
  - Dataset Name
  - Dataset Description
  - Upload Date
  - Dataset Size
  - Category Tags
  - Number of Likes
  - Author (Wallet Address / Username)
- Sorting options: Popularity, Upload Date, Size, Category
- Clicking a dataset redirects to its detail page

#### Implementation Plan:
1. **Database Schema (Supabase)**
    - Table: `datasets`
      - `id`: UUID (Primary Key)
      - `name`: String
      - `description`: Text
      - `upload_date`: Timestamp
      - `size`: Integer (MB/GB)
      - `category_tags`: Array of Strings
      - `likes`: Integer (default: 0)
      - `file_url`: String (Supabase Storage URL)
      - `author_id`: UUID (References `users.id`)

2. **API Integration (Frontend - Next.js)**
    - Use Supabase client to fetch dataset list
    - Implement search and sorting functionality
    
3. **UI Components (Shadcn & Tailwind)**
    - `DatasetCard.tsx` (for displaying dataset details)
    - `DatasetList.tsx` (for fetching and rendering dataset cards)
    - `DatasetPage.tsx` (individual dataset details)

### 3.3 Dataset Details Page
#### Requirements:
- Display dataset information with metadata
- Show first 10 rows of the dataset preview
- Allow users to like the dataset
- Display dataset author information
- Authors should be able to edit or delete datasets they created

#### Implementation Plan:
1. Fetch dataset details using Supabase `id`
2. Render dataset metadata and preview first 10 rows using a table component
3. Implement `like` functionality with Supabase database update
4. Implement edit/delete functionality for dataset authors

### 3.4 Create New Dataset
#### Requirements:
- Modal form for dataset creation:
  - Dataset Name (required)
  - Description (required)
  - Visibility (Public/Private)
  - Categories (Multi-select dropdown)
  - License Type (Dropdown)
  - Automatically assign dataset author based on logged-in user
- File upload (CSV, JSON, etc.)
- Store metadata in Supabase database
- Store file in Supabase Storage
- Redirect to dataset details page after creation

#### Implementation Plan:
1. **UI Components**
   - `NewDatasetModal.tsx` (Shadcn modal for dataset creation)
   - `UploadFile.tsx` (File upload component integrated with Supabase Storage)

2. **API Calls**
   - Insert dataset metadata into `datasets` table, including `author_id`
   - Upload file to Supabase Storage and update dataset record
   - Redirect user to dataset details page after successful upload

3. **Form Validation**
   - Ensure required fields are filled
   - Validate file format before upload

### 3.5 User Management
#### Requirements:
- Allow users to associate their wallet address with a username and email address
- Display user profile information
- Show datasets contributed by a specific user

#### Implementation Plan:
1. **User Profile Page**
   - Create a user profile page to display user information
   - Show datasets contributed by the user

2. **User Management System**
   - Allow users to associate their wallet address with a username and email address
   - Store user details in the database

3. **Profile Information**
   - Display user profile information on the profile page
   - Show datasets contributed by the user

### 3.6 Dataset Ownership
#### Requirements:
- Display the author of a dataset on the dataset details page
- Display the author of a dataset on the dataset listing page
- Allow dataset authors to edit dataset details
- Allow dataset authors to delete their datasets

#### Implementation Plan:
1. **Edit Dataset**
   - Add edit functionality to the dataset details page
   - Allow authors to update dataset metadata
   - Ensure authors can only edit their own datasets

2. **Delete Dataset** 
   - Add delete functionality to the dataset details page
   - Ensure authors can only delete their own datasets

### 3.7 Search & Filtering
#### Requirements:
- Implement search functionality to find datasets by name or description
- Implement filtering functionality to filter datasets by category, license, etc.

#### Implementation Plan: 
1. **Search Functionality**
   - Add search functionality to the dataset listing page
   - Implement search functionality to find datasets by name or description

2. **Filtering Functionality**
   - Add filtering functionality to the dataset listing page
   - Implement filtering functionality to filter datasets by category, license, etc. 

---

## 4. Next Steps & Milestones
1. Set up Supabase database and authentication
2. Develop dataset listing & sorting features
3. Implement dataset details page
4. Build dataset creation & upload functionality
5. Integrate Solana Wallet authentication
6. Enable users to assign usernames and emails
7. Implement dataset editing & deletion by authors
8. Optimize UI & deploy MVP

---
