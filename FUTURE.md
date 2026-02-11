# RoofStack Feature Status

Four columns: **Category** | **Feature** | **Status** | **Notes**.

---

## ✅ Completed

| Category | Feature | Status | Notes |
|----------|---------|--------|-------|
| Core UI | Home page with hero & features | ✅ Done | Responsive design with Tailwind |
| Core UI | Header component with navigation | ✅ Done | Responsive hamburger menu for mobile |
| Core UI | Login page with form | ✅ Done | UI only, not connected to auth |
| Core UI | Signup page with form | ✅ Done | Connected to Supabase auth; creates user, company, profile |
| Core UI | Dashboard with 4 main cards | ✅ Done | Lead Gen, Prospects, Builds, Invoicing |
| Core UI | Reusable Button component | ✅ Done | Multiple variants with hover effects |
| Core UI | Responsive tab system | ✅ Done | Used in leads page |
| Territory Management | Google Maps integration | ✅ Done | Interactive map with proper centering |
| Territory Management | Drop pins on map click | ✅ Done | Creates markers at clicked location |
| Territory Management | Status-based marker colors | ✅ Done | Heat map visualization (green → red) |
| Territory Management | 10 distinct lead statuses | ✅ Done | From "not contacted" to "do not contact" |
| Territory Management | Click marker to open popup | ✅ Done | Shows on second click |
| Territory Management | Status change dropdown | ✅ Done | All 10 statuses available |
| Territory Management | Conditional lead form | ✅ Done | Appears for inspection/damages/follow up |
| Territory Management | Lead form with 6 fields | ✅ Done | Name, email, phone, address, contact pref, notes |
| Territory Management | Form validation (required fields) | ✅ Done | Visual indicators for required fields |

---

## 🚧 Leads — To Complete

### Backend

| Category | Feature | Status | Notes |
|----------|---------|--------|-------|
| Backend | Supabase project setup | ✅ Done | Client in `lib/supabase.ts`; companies & profiles in use |
| Backend | Database schema design | ✅ Done | Companies, Profiles tables used in signup (Leads table TBD) |
| Backend | Row Level Security policies | ⏳ To Do | Multi-tenant data isolation (verify in Supabase dashboard) |
| Backend | User authentication system | ✅ Done | Signup connected (auth + profile); login page not connected yet |
| Backend | User profiles with company_id | ✅ Done | Signup inserts profile with company_id, full_name, role |
| Backend | Role-based permissions | ⏳ To Do | Rep, Manager, Admin roles |

### Lead Management

| Category | Feature | Status | Notes |
|----------|---------|--------|-------|
| Lead Management | Save lead to database | ✅ Done | Connect form submit to Supabase |
| Lead Management | Update marker status in DB | ✅ Done | Persist status changes |
| Lead Management | Fetch leads from database | ✅ Done | Load existing leads on page load |
| Lead Management | Display leads in list view | ✅ Done | "Leads List" tab implementation |
| Lead Management | Lead cards with details | ✅ Done | Show lead info in card format |
| Lead Management | Filter leads by status | ✅ Done | Dropdown or tabs to filter |
| Lead Management | Search leads | ✅ Done | By name, address, or phone |
| Lead Management | Edit existing leads | ✅ Done | Click lead card to edit |
| Lead Management | Delete leads | ✅ Done | With confirmation modal |
| Lead Management | Associate leads with markers | ✅ Done | Link database leads to map pins |
| Lead Management | Load marker positions from DB | ✅ Done | Show existing leads as pins on map |
| Lead Management | Click marker to view lead details | ⏳ To Do | Show full lead info in popup |
| Lead Management | Click marker on map to view lead details | ⏳ To Do | Show full lead info in popup |

---

## 📅 Inspections — To Build

| Category | Feature | Status | Notes |
|----------|---------|--------|-------|
| Inspections | Calendar component | ⏳ To Do | Monthly view of inspections |
| Inspections | Schedule inspection form | ✅ Done | Date, time, lead association |
| Inspections | Inspection database table | ✅ Done | Store scheduled inspections |
| Inspections | Link inspection to lead | ✅ Done | Foreign key relationship |
| Inspections | Mark inspection complete | ⏳ To Do | Update status with notes |
| Inspections | Inspection history | ⏳ To Do | View past inspections for a lead |
| Inspections | Upcoming inspections dashboard | ⏳ To Do | Today, this week, this month |
| Inspections | Inspection reminders | ⏳ To Do | Notifications for upcoming |

---

## 🚀 Future Features

### Advanced Territory

| Category | Feature | Status | Notes |
|----------|---------|--------|-------|
| Advanced Territory | Drawing tools for territories | 💡 Future | Polygons to define coverage areas |
| Advanced Territory | Heat map overlay | 💡 Future | Visualize lead density |
| Advanced Territory | Route optimization | 💡 Future | Best path to visit multiple leads |
| Advanced Territory | Address autocomplete | 💡 Future | Google Places API integration |
| Advanced Territory | Street view integration | 💡 Future | See property before visit |

### Lead Tracking

| Category | Feature | Status | Notes |
|----------|---------|--------|-------|
| Lead Tracking | Lead source tracking | 💡 Future | Door knock, referral, online, etc. |
| Lead Tracking | Lead scoring | 💡 Future | Prioritize based on likelihood to close |
| Lead Tracking | Conversion funnel analytics | 💡 Future | Visualize lead progression |
| Lead Tracking | Activity timeline | 💡 Future | History of all interactions |
| Lead Tracking | File attachments | 💡 Future | Upload photos, documents |
| Lead Tracking | Tags/labels system | 💡 Future | Custom categorization |

### Communication

| Category | Feature | Status | Notes |
|----------|---------|--------|-------|
| Communication | SMS integration | 💡 Future | Send texts from app |
| Communication | Email integration | 💡 Future | Send emails from app |
| Communication | Call logging | 💡 Future | Track phone conversations |
| Communication | Automated follow-ups | 💡 Future | Scheduled reminders |

### Prospects

| Category | Feature | Status | Notes |
|----------|---------|--------|-------|
| Prospects | Prospect tracking system | 💡 Future | Between lead and contract |
| Prospects | Proposal generation | 💡 Future | Create estimates/quotes |
| Prospects | E-signature integration | 💡 Future | DocuSign or similar |
| Prospects | Document templates | 💡 Future | Reusable contract templates |

### Builds

| Category | Feature | Status | Notes |
|----------|---------|--------|-------|
| Builds | Project management board | 💡 Future | Kanban or Gantt view |
| Builds | Material tracking | 💡 Future | Inventory management |
| Builds | Crew assignment | 💡 Future | Assign teams to projects |
| Builds | Progress photos | 💡 Future | Document work stages |
| Builds | Completion checklist | 💡 Future | Quality assurance steps |

### Invoicing

| Category | Feature | Status | Notes |
|----------|---------|--------|-------|
| Invoicing | Invoice generation | 💡 Future | Professional PDF invoices |
| Invoicing | Payment tracking | 💡 Future | Track paid/unpaid/partial |
| Invoicing | Payment gateway integration | 💡 Future | Stripe or Square |
| Invoicing | Recurring billing | 💡 Future | For maintenance contracts |
| Invoicing | Financial reports | 💡 Future | Revenue, outstanding, etc. |

### Analytics

| Category | Feature | Status | Notes |
|----------|---------|--------|-------|
| Analytics | Dashboard analytics | 💡 Future | KPIs and metrics |
| Analytics | Lead conversion rates | 💡 Future | By rep, by source, by time |
| Analytics | Sales performance tracking | 💡 Future | Individual and team metrics |
| Analytics | Territory performance | 💡 Future | Which areas are most profitable |
| Analytics | Export reports | 💡 Future | PDF/Excel export |

### Team Management

| Category | Feature | Status | Notes |
|----------|---------|--------|-------|
| Team Management | Team member management | 💡 Future | Add/remove users |
| Team Management | Permission management | 💡 Future | Granular role controls |
| Team Management | Activity logs | 💡 Future | Audit trail of changes |
| Team Management | Leaderboards | 💡 Future | Gamification for sales teams |

### Mobile

| Category | Feature | Status | Notes |
|----------|---------|--------|-------|
| Mobile | Progressive Web App | 💡 Future | Mobile-optimized experience |
| Mobile | Offline mode | 💡 Future | Work without internet |
| Mobile | GPS tracking | 💡 Future | Track rep locations |
| Mobile | Mobile-specific features | 💡 Future | Camera, voice notes, etc. |

### Integrations

| Category | Feature | Status | Notes |
|----------|---------|--------|-------|
| Integrations | CRM integration | 💡 Future | Salesforce, HubSpot, etc. |
| Integrations | Accounting software | 💡 Future | QuickBooks, Xero |
| Integrations | Weather API | 💡 Future | Plan around weather conditions |
| Integrations | Social media leads | 💡 Future | Import from Facebook/Instagram |

---

## Summary

| Status | Count |
|--------|-------|
| ✅ Completed | 17 UI + Territory features; 3 Backend items done (Supabase, schema, profiles) |
| 🚧 In progress (Leads) | 1 partial (auth: signup done, login not); 14 Lead Management + 2 Backend (RLS, roles) |
| 📅 Inspections | 8 features (after leads complete) |
| 🚀 Future features | 45+ features (long-term vision) |
