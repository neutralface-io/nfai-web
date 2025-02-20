# AI Data Crowdsourcing Platform - Product Design Document

## **1. Overview**
The AI Data Crowdsourcing Platform enables users to upload, manage, and label datasets for fine-tuning AI models or as part of retrieval-augmented generation (RAG) pipelines. The platform provides an intuitive interface for dataset discovery, contribution, and interaction.

## **2. Technology Stack**
- **Frontend:** Next.js 14, Shadcn, Tailwind CSS, Lucide Icons
- **Backend:** Supabase (PostgreSQL, Authentication, Storage)

---

## **3. Core Features & Requirements**

### **3.1 Dataset Listing**
#### **Requirements:**
- Fetch dataset list from Supabase
- Display datasets as cards containing:
  - Dataset Name
  - Dataset Description
  - Upload Date
  - Dataset Size
  - Category Tags
  - Number of Likes
- Sorting options: Popularity, Upload Date, Size, Category
- Clicking a dataset redirects to its detail page

#### **Implementation Plan:**
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

2. **API Integration (Frontend - Next.js)**
    - Use Supabase client to fetch dataset list
    - Implement search and sorting functionality
    
3. **UI Components (Shadcn & Tailwind)**
    - `DatasetCard.tsx` (for displaying dataset details)
    - `DatasetList.tsx` (for fetching and rendering dataset cards)
    - `DatasetPage.tsx` (individual dataset details)

### **3.2 Dataset Details Page**
#### **Requirements:**
- Display dataset information with metadata
- Show first 10 rows of the dataset preview
- Allow users to like the dataset

#### **Implementation Plan:**
1. Fetch dataset details using Supabase `id`
2. Render dataset metadata and preview first 10 rows using a table component
3. Implement `like` functionality with Supabase database update

### **3.3 Create New Dataset**
#### **Requirements:**
- Modal form for dataset creation:
  - Dataset Name (required)
  - Description (required)
  - Visibility (Public/Private)
  - Categories (Multi-select dropdown)
  - License Type (Dropdown)
- File upload (CSV, JSON, etc.)
- Store metadata in Supabase database
- Store file in Supabase Storage
- Redirect to dataset details page after creation

#### **Implementation Plan:**
1. **UI Components**
   - `NewDatasetModal.tsx` (Shadcn modal for dataset creation)
   - `UploadFile.tsx` (File upload component integrated with Supabase Storage)

2. **API Calls**
   - Insert dataset metadata into `datasets` table
   - Upload file to Supabase Storage and update dataset record
   - Redirect user to dataset details page after successful upload

3. **Form Validation**
   - Ensure required fields are filled
   - Validate file format before upload

---

## **4. Supabase Configuration**

### **4.1 Supabase Initialization**
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
```

### **4.2 Database Tables**
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

---

## **5. UI Wireframes & Design Considerations**

- Dataset cards should be visually engaging with clear CTAs
- Modal should be simple and user-friendly
- Table layout for dataset preview should be readable and scalable
- Mobile responsiveness is required

---

## **6. Next Steps & Milestones**
1. Set up Supabase database and authentication
2. Develop dataset listing & sorting features
3. Implement dataset details page
4. Build dataset creation & upload functionality
5. Optimize UI & deploy MVP

---