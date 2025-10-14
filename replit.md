# Multi-Role SaaS POS System

## Project Overview
A premium multi-role Point of Sale system designed for mobile repair shops with three distinct user dashboards (Super Admin, Admin/Shop Owner, and Sales Person).

## Technology Stack
- **Frontend**: React, TypeScript, Wouter (routing), TailwindCSS
- **Backend**: Express.js, Node.js
- **UI Components**: Shadcn UI, Radix UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Charts**: Recharts
- **Storage**: In-memory storage (MemStorage)

## Design System

### Current Design (v2.0 - Premium Modern)
The application features a **modern, luxurious, and premium design** inspired by high-end fintech apps and SaaS dashboards.

#### Color Palette
- **Primary**: Deep Indigo (233 47% 25%) - Sophisticated depth
- **Accent**: Royal Purple (265 85% 65%) - Premium luxury
- **Secondary**: Slate (215 25% 27%) - Professional anchor
- **Success**: Teal-Green (158 64% 52%)
- **Warning**: Amber (38 95% 62%)
- **Error**: Controlled Red (0 72% 51%)

#### Visual Features
- **Dark sidebar** with gradient backgrounds and bright hover states
- **Premium stat cards** with gradient headers and decorative circles
- **Modern charts** with gradient fills and smooth animations
- **Glass-morphism effects** on header (backdrop blur)
- **Sophisticated shadows** - subtle elevation throughout
- **Animated login page** with blob animations
- **Rounded borders** (xl/2xl) for premium feel
- **Color-coded role indicators** with gradients

### Component Design
1. **Sidebar**: Dark theme (deep indigo) with purple accent hover states, rounded navigation items
2. **Header**: Glass-morphism effect with backdrop blur, sticky positioning
3. **Stat Cards**: Gradient backgrounds with decorative circles, trend indicators
4. **Charts**: Gradient-filled line charts with smooth curves
5. **Tables**: Hover states, striped rows, status indicators with dots
6. **Login Page**: Animated gradient blobs, premium card with shadow

## User Roles & Authentication

### Demo Accounts
- **Super Admin**: `superadmin / admin123`
- **Admin**: `admin / admin123`
- **Sales Person**: `sales / sales123`

### Role-Based Features

#### Super Admin
- Dashboard with system-wide analytics
- Manage all shop admins
- Configure pricing plans
- View system analytics

#### Admin (Shop Owner)
- Shop performance dashboard
- Product & category management
- Sales reports & analytics
- Staff management
- Subscription management
- POS access

#### Sales Person
- POS interface
- Recent sales view
- Product catalog access

## Dashboard Features

### Admin Dashboard Includes:
1. **Stat Cards** (4):
   - Today's Sales (Teal gradient)
   - Wallet Balance (Blue-Indigo gradient)
   - Total Stock Available (Purple-Pink gradient)
   - Clients Credit (Amber-Orange gradient)

2. **Sales Analytics Chart**:
   - Multi-period views (Weekly, Monthly, Yearly, Custom)
   - Dual-line chart (Sales & Profit)
   - Gradient fills and smooth curves

3. **Devices in Repair**:
   - Active repair queue table
   - Status indicators with colored dots
   - Estimated completion dates

4. **Recent Sales**:
   - Last 5 transactions
   - Customer details
   - Item breakdown
   - View All button

5. **Low Stock Alert**:
   - Products below minimum threshold
   - Out of stock indicators
   - Category breakdown

## Project Structure

```
client/src/
├── components/
│   ├── ui/ (Shadcn components)
│   ├── AppSidebar.tsx
│   ├── AppHeader.tsx
│   ├── StatCard.tsx
│   ├── SalesAnalyticsChart.tsx
│   ├── DataTable.tsx
│   ├── DevicesInRepair.tsx
│   ├── LastSales.tsx
│   └── LowStockAlert.tsx
├── pages/
│   ├── auth/Login.tsx
│   ├── admin/ (Admin dashboard & pages)
│   ├── superadmin/ (Super admin pages)
│   └── pos/ (POS interface)
├── store/authStore.ts
├── utils/mockData.ts
└── index.css

server/
├── index.ts
├── routes.ts
└── storage.ts

shared/
└── schema.ts
```

## Recent Changes (Latest Session)

### Complete Design Overhaul
- Updated entire color scheme to premium indigo/purple palette
- Redesigned sidebar with dark theme and bright hover states
- Added glass-morphism header with backdrop blur
- Enhanced stat cards with gradients and decorative elements
- Improved charts with gradient fills
- Added animated login page with blob animations
- Updated all tables with better hover states and status indicators
- Consistent rounded corners (xl/2xl) throughout
- Premium shadows and elevation effects

### Technical Improvements
- Optimized component structure
- Added hover-elevate and active-elevate-2 utility classes
- Implemented proper color theming with CSS variables
- Enhanced responsive design
- Improved accessibility with better contrast ratios

## Development Notes

### Mock Data
Currently using mock data for prototype with `//todo: remove mock functionality` comments. These should be replaced with actual API calls when backend is ready.

### Future Enhancements
- Connect to real backend API
- Implement real-time updates with WebSockets
- Add more detailed analytics
- Implement receipt printing
- Add barcode scanning functionality
- Multi-language support (currently has UI for 5 languages)
- Dark mode toggle (infrastructure ready)

## Running the Application
```bash
npm run dev
```
Server runs on port 5000 with both frontend and backend on same port.

## Design Guidelines
See `design_guidelines.md` for comprehensive design system documentation.
