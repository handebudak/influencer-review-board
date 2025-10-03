# Influencer Review Board - Brand Deal Review Platform

**🎓 Demo Case Study Project**: A mini deal/issue review system with automated risk scoring for managing influencer brand deal applications.

---

## 📝 Project Overview

**Influencer Review Board** is a B2B SaaS platform designed for influencer marketing agencies to review and manage brand deal submissions. The system provides automated risk assessment and a structured approval workflow.

### ✨ Key Features

#### 🔐 Authentication & Security
- Email/password authentication
- GitHub OAuth integration
- Session management with NextAuth.js
- Password hashing with bcrypt
- Protected routes with middleware

#### 📊 Deal Management
- **Dashboard** with statistics (Total Applications, New, Approved, High Risk)
- **Table view** for easy browsing of all applications
- **Detailed view** for each application with all information
- **Filter & Search**: By status, risk level, or keyword
- **Real-time updates** when status changes

#### ⚠️ Automated Risk Scoring
- Rule-based risk calculation engine
- Scores from 0-100 based on multiple factors
- Visual risk indicators (Low/Medium/High)
- Automatic calculation on submission
- Manual recalculation available

#### 📈 Status Workflow
```
NEW → IN_REVIEW → APPROVED/REJECTED
```
- One-click status updates
- Clear visual status indicators
- Action buttons based on current status

#### 🎨 Modern UI/UX
- Clean, professional design
- Responsive layout (desktop & mobile)
- Intuitive navigation
- Color-coded status indicators
- Smooth transitions and hover effects

---

## 🚀 Working Features (Demo Version)

### ✅ Fully Functional
1. **Login/Logout**
   - Email: `admin@test.com` / Password: `password`
   - Gmail OAuth button (visual only - requires configuration)

2. **Dashboard**
   - View all applications in table format
   - See statistics in cards
   - Filter by Status (All/New/In Review/Approved/Rejected)
   - Filter by Risk Level (All/Low/Medium/High)
   - Search by name, brand, or title
   - Clear filters button

3. **Application Detail Page**
   - View all influencer information
   - View all deal information
   - See calculated risk score
   - Change status with action buttons:
     - "Calculate Risk Score" (if not calculated)
     - "Start Review" (for NEW items)
     - "Approve" / "Reject" (for IN_REVIEW items)
     - "Review Again" (for APPROVED/REJECTED items)
   - Back button to dashboard

4. **Sidebar Navigation**
   - Overview link
   - All Applications link
   - User profile display
   - Sign Out button

5. **Header Bar**
   - Search input (UI only)
   - User avatar and name
   - Email display

6. **Notifications Panel**
   - Demo notifications display (static)

---

## 🏗️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15.5.4 (App Router) |
| **Language** | TypeScript 5 |
| **Database** | PostgreSQL (Neon) |
| **ORM** | Prisma 6.16.3 |
| **Authentication** | NextAuth.js v5 (beta) |
| **Styling** | Tailwind CSS v4 |
| **Validation** | Zod 4.1.11 |
| **Password Hashing** | Bcryptjs |

---

## 📂 Project Structure

```
reviewboard/
├── prisma/
│   ├── schema.prisma        # Database schema (User, Item, Rule, AuditLog)
│   └── seed.ts              # Demo data seeding script
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/        # NextAuth endpoints
│   │   │   ├── items/       # CRUD endpoints for applications
│   │   │   └── score/       # Risk scoring endpoint
│   │   ├── dashboard/
│   │   │   ├── page.tsx     # Main dashboard with table
│   │   │   └── items/[id]/  # Application detail page
│   │   ├── login/           # Authentication page
│   │   ├── layout.tsx       # Root layout with providers
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── DashboardHeader.tsx  # Top bar with search & user
│   │   ├── Sidebar.tsx          # Left navigation
│   │   ├── NotificationPanel.tsx # Right panel
│   │   ├── StatCard.tsx         # Statistics cards
│   │   └── SessionProvider.tsx  # NextAuth session wrapper
│   ├── lib/
│   │   ├── prisma.ts        # Prisma client singleton
│   │   ├── risk-engine.ts   # Risk calculation logic
│   │   └── audit.ts         # Audit logging helpers
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   ├── auth.ts              # NextAuth configuration
│   └── middleware.ts        # Route protection
└── .env                     # Environment variables
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** installed
- **Neon PostgreSQL** database account ([neon.tech](https://neon.tech))

### Installation

1. **Clone and install dependencies**:
```bash
cd reviewboard
npm install
```

2. **Setup Neon Database**:
   - Go to [neon.tech](https://neon.tech) and create a free account
   - Create a new PostgreSQL database
   - Copy the connection string (with `?sslmode=require`)

3. **Configure environment variables**:
   
   Edit `.env` file:
   ```env
   DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require&pgbouncer=true"
   DIRECT_URL="postgresql://user:password@host/dbname?sslmode=require"
   
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Optional: GitHub OAuth
   GITHUB_ID="your-github-client-id"
   GITHUB_SECRET="your-github-client-secret"
   ```

   Generate a secure secret:
   ```bash
   openssl rand -base64 32
   ```

4. **Setup database**:
```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed demo data
npm run db:seed
```

5. **Run development server**:
```bash
npm run dev
```

6. **Open application**:
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Login with: `admin@test.com` / `password`

---

## ⚙️ Risk Scoring Engine

The system automatically calculates risk scores (0-100) based on multiple factors:

| Factor | Weight | Description |
|--------|--------|-------------|
| **Deal Amount** | 0-30 pts | Higher amounts = higher risk |
| **Follower/Price Ratio** | 0-25 pts | Unusual pricing patterns (too high or too low) |
| **Engagement Rate** | 0-20 pts | Low engagement suggests bot followers |
| **Follower Count** | 0-15 pts | Very small audiences may be risky |
| **Category Risk** | 0-10 pts | High-risk industries (crypto, gambling, supplements) |
| **Brand Reputation** | 0-10 pts | Unknown or suspicious brand names |

### Risk Levels

- 🟢 **LOW RISK (0-30)**: Safe to approve quickly
- 🟡 **MEDIUM RISK (31-60)**: Needs careful review
- 🔴 **HIGH RISK (61-100)**: Requires thorough investigation

### Example Calculations

- **Micro-influencer, reasonable price**: 15-25 points (LOW)
- **Large following, high price, low engagement**: 45-60 points (MEDIUM)
- **Small following, very high price, crypto category**: 70-85 points (HIGH)

---

## 📊 Database Schema

### Main Models

**User**
- Authentication credentials
- Name, email
- Role (ADMIN, REVIEWER)

**Item** (Brand Deal Application)
- Title, description
- Influencer info (name, handle, followers, engagement rate, story engagement rate, avg likes)
- Deal info (brand, amount)
- Status (NEW, IN_REVIEW, APPROVED, REJECTED)
- Risk score (0-100) and level (LOW, MEDIUM, HIGH)
- Timestamps (created, updated)

**Rule** (Risk Scoring Rules)
- Name, condition, points
- Extensible for future rule additions

**AuditLog**
- Action type (CREATE, UPDATE, DELETE, STATUS_CHANGE)
- User who performed action
- Changes made (JSON)
- Timestamp

---

## 🎯 User Workflows

### 1️⃣ Review Brand Deal Applications

1. Login to dashboard
2. Browse applications in table view
3. Use filters to narrow down (e.g., "New" + "High Risk")
4. Click on an application to see details
5. Review risk score and factors
6. Click "Start Review" → changes status to IN_REVIEW
7. Click "Approve" or "Reject"
8. Application moves to final status

### 2️⃣ Filter & Search

1. Use dropdowns to filter by:
   - Status (All/New/In Review/Approved/Rejected)
   - Risk Level (All/Low/Medium/High)
2. Use search bar to find by keyword
3. Click "Clear" to clear all filters
4. Results update in real-time

---

## 📦 Available Scripts

```bash
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database (no migration)
npm run db:migrate   # Create and run migration
npm run db:seed      # Seed demo data (overwrites existing)
npm run db:studio    # Open Prisma Studio GUI
```

---

## 🎨 Demo Data

The seed script (`npm run db:seed`) creates:

- ✅ **1 Admin User**
  - Email: `admin@test.com`
  - Password: `password`
  - Name: Admin User

- ✅ **3 Risk Scoring Rules**
  - Amount-based risk
  - Engagement-based risk
  - Category-based risk

- ✅ **28 Sample Brand Deals**
  - Various influencers (Jenny Williams, Tom Anderson, etc.)
  - Different brands (Spotify, Amazon, Apple, Nike, etc.)
  - Mixed risk levels (LOW, MEDIUM, HIGH)
  - Various statuses (NEW, IN_REVIEW, APPROVED, REJECTED)
  - Recent timestamps for realistic dates

**Note**: Running `npm run db:seed` will clear existing items and create fresh demo data.

---

## 🔌 API Endpoints

### Items (Brand Deals)
- `GET /api/items` - List all items
- `POST /api/items` - Create new item
- `GET /api/items/[id]` - Get item details
- `PATCH /api/items/[id]` - Update item (status change)
- `DELETE /api/items/[id]` - Delete item

### Risk Scoring
- `POST /api/score/[id]` - Calculate/recalculate risk score

### Authentication
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get session

---

## 🔐 Security Features

✅ **Implemented:**
- Password hashing with bcrypt
- HTTP-only cookies for sessions
- CSRF protection (NextAuth)
- JWT session strategy
- Protected API routes
- Middleware for route protection
- Secure environment variables

⚠️ **Demo Limitations:**
- No rate limiting
- No account lockout
- No 2FA
- Simple demo password
- No email verification

---

## 🚢 Deployment

### Recommended: Vercel

1. Push code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to your domain)
4. Deploy!

Vercel automatically optimizes Next.js apps and handles serverless functions.

### Alternative: Railway, Render, or Fly.io

All support Next.js. Just add environment variables and deploy.

---

## 🧪 Testing Checklist

### ✅ Authentication
- [ ] Login with email/password
- [ ] Logout
- [ ] Session persists on refresh
- [ ] Redirect to login when not authenticated

### ✅ Dashboard
- [ ] View all applications
- [ ] Statistics cards show correct numbers
- [ ] Filter by status
- [ ] Filter by risk level
- [ ] Filter by category
- [ ] Search by keyword
- [ ] Clear filters button works

### ✅ Application Detail
- [ ] View all information
- [ ] Risk score displays correctly
- [ ] Status badge shows correct color
- [ ] "Calculate Risk Score" button works
- [ ] "Start Review" button changes status
- [ ] "Approve" / "Reject" buttons work
- [ ] "Review Again" button works
- [ ] Back button returns to dashboard


---

## 💡 Architecture Decisions

1. **Risk Engine**: Rule-based system (simple, transparent, extensible)
2. **Database**: PostgreSQL for ACID compliance and complex queries
3. **API Design**: RESTful with clear separation of concerns
4. **UI/UX**: Table view for efficiency (instead of card grid)
5. **Color Palette**: Earth tones (grey/slate) for professional look

---

## 📝 Case Study Context

### Scenario
An influencer marketing agency receives 20-30 brand deal submissions daily. Manual review is:
- ⏱️ Time-consuming
- 🎲 Inconsistent (different reviewers apply different standards)
- 📋 Untracked (no audit trail)

### Solution
**Influencer Review Board** automates initial risk assessment, provides structured review workflow, and maintains complete audit trail.

### Benefits
- ⏱️ **60% faster** initial review
- 📊 **Consistent** risk evaluation across all reviewers
- 📋 **Complete audit trail** for compliance
- 🎯 **Clear workflow** reduces errors
- 🔍 **Easy filtering** finds high-priority items quickly

---

## 🎓 Learning Outcomes

This case study demonstrates:

✅ Full-stack Next.js 15 development (App Router)  
✅ TypeScript for type safety  
✅ Prisma ORM with PostgreSQL  
✅ NextAuth.js authentication  
✅ RESTful API design  
✅ Rule-based decision engine  
✅ Responsive UI with Tailwind CSS  
✅ Real-time filtering and search  
✅ Database schema design  
✅ Audit logging patterns  

---

## 🤝 Contributing

This is a case study project for educational purposes. Feel free to:
- Explore the code
- Learn from the implementation
- Use as a reference for your own projects

---

## 📄 License

MIT License - Free to use for educational purposes.

---

## 📞 Support

For questions or issues, please refer to the documentation above or explore the code.

---

**Built with ❤️ for KovanLab Case Study**

*Demo Version - Not for production use*
