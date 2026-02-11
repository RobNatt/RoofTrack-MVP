# 🚀 Quick Start Guide

Get RoofStack running locally in 5 minutes!

---

## Prerequisites Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] Supabase account (free tier is fine)
- [ ] Google Cloud account (for Maps API)

---

## Step 1: Clone & Install (2 min)

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/roofstack.git
cd roofstack

# Install dependencies
npm install
```

---

## Step 2: Supabase Setup (1 min)

1. Go to https://supabase.com
2. Create new project (takes ~2 min to provision)
3. Go to Settings → API
4. Copy:
   - Project URL
   - Anon/Public key

---

## Step 3: Google Maps Setup (1 min)

1. Go to https://console.cloud.google.com
2. Create new project (or use existing)
3. Enable APIs:
   - Maps JavaScript API
   - Geocoding API
4. Create credentials → API Key
5. (Optional) Restrict API key to your domain

---

## Step 4: Environment Variables (30 sec)

```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local with your actual keys
# Use nano, vim, or your favorite editor
nano .env.local
```

Fill in:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyD...
```

---

## Step 5: Database Setup (1 min)

1. Open Supabase SQL Editor
2. Run migrations in order:

**Create Companies:**
```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
```

**Create Profiles:**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('rep', 'manager', 'admin')) DEFAULT 'rep',
  full_name TEXT NOT NULL,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

**Create Leads:**
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  address TEXT NOT NULL,
  status TEXT CHECK (status IN (
    'not contacted', 'contacted', 'inspection', 'damages', 
    'follow up', 'closed - won', 'closed - lost', 'contractor',
    'not interested', 'do not contact'
  )) NOT NULL,
  latitude FLOAT,
  longitude FLOAT,
  notes TEXT,
  preferred_contact_method TEXT CHECK (
    preferred_contact_method IN ('none', 'email', 'phone')
  ) DEFAULT 'none',
  date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date_last_contacted TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
```

**Create Inspections:**
```sql
CREATE TABLE inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  status TEXT CHECK (status IN ('scheduled', 'completed', 'canceled')) DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
```

**RLS Policies:**
```sql
-- Companies
CREATE POLICY "Users can view own company"
ON companies FOR SELECT
USING (id = (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- Profiles
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Users can view company members"
ON profiles FOR SELECT
USING (company_id = (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- Leads (company-scoped)
CREATE POLICY "Company members can view leads"
ON leads FOR SELECT
USING (company_id = (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can create leads"
ON leads FOR INSERT
WITH CHECK (
  company_id = (SELECT company_id FROM profiles WHERE id = auth.uid())
  AND user_id = auth.uid()
);

CREATE POLICY "Update leads"
ON leads FOR UPDATE
USING (
  company_id = (SELECT company_id FROM profiles WHERE id = auth.uid())
  AND (
    user_id = auth.uid()
    OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('manager', 'admin')
  )
);

CREATE POLICY "Delete leads"
ON leads FOR DELETE
USING (
  company_id = (SELECT company_id FROM profiles WHERE id = auth.uid())
  AND (
    user_id = auth.uid()
    OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('manager', 'admin')
  )
);

-- Inspections (same pattern as leads)
CREATE POLICY "Company members can view inspections"
ON inspections FOR SELECT
USING (company_id = (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can create inspections"
ON inspections FOR INSERT
WITH CHECK (
  company_id = (SELECT company_id FROM profiles WHERE id = auth.uid())
  AND user_id = auth.uid()
);

CREATE POLICY "Update inspections"
ON inspections FOR UPDATE
USING (
  company_id = (SELECT company_id FROM profiles WHERE id = auth.uid())
  AND (
    user_id = auth.uid()
    OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('manager', 'admin')
  )
);
```

---

## Step 6: Run! (10 sec)

```bash
npm run dev
```

Open http://localhost:3000

---

## ✅ Success Checklist

You should see:
- [ ] Landing page loads
- [ ] "Login" and "Get Started" buttons in header
- [ ] Can navigate to /signup
- [ ] Can create account
- [ ] After signup, redirects to dashboard
- [ ] Dashboard shows 4 cards (Leads, Prospects, Builds, Invoicing)

---

## 🐛 Troubleshooting

**Map not loading?**
- Check Google Maps API key is correct
- Verify APIs are enabled (Maps JavaScript + Geocoding)
- Check browser console for errors

**Can't sign up?**
- Check Supabase URL and key are correct
- Verify Supabase Auth is enabled
- Check Supabase logs for errors

**Database errors?**
- Verify all migrations ran successfully
- Check RLS policies are created
- Test queries in Supabase SQL editor

**Still stuck?**
- Check browser console (F12)
- Check terminal for errors
- Review .env.local is filled correctly

---

## 🎉 You're Ready!

Try these next:
1. Create a lead from "Leads → Add New Lead"
2. Drop a pin on the territory map
3. Schedule an inspection
4. View the calendar

---

## 📚 Learn More

- [Full README](./README.md)
- [Complete PRD](./docs/RoofStack_Complete_PRD_Master.md)
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
