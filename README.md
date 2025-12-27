# 🏨 Hostel Management System - Next.js Edition

## 🎓 **Perfect for University Defense!**

A modern, professional hostel management system built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. Features advanced analytics, PDF reports, and a stunning glassmorphic UI.

---

## ✨ Complete Feature List

### 🔐 Authentication System
- **Dual Login**: Admin and Student roles
- **Session Management**: Secure localStorage-based auth
- **Protected Routes**: Automatic redirection

### 📊 Dashboard
- **Real-time Statistics**: Students, Rooms, Fees, Complaints
- **Recent Activity**: Latest student registrations
- **Quick Actions**: Navigate to key features
- **Animated Cards**: Smooth fade-in effects

### 👥 Student Management
- **CRUD Operations**: Add, Edit, Delete students
- **Search & Filter**: Find students instantly
- **Data Fields**: ID, Name, Phone, Email, Room, Fee Status
- **Modal Forms**: Beautiful glassmorphic dialogs

### 🏠 Room Management
- **Visual Cards**: Grid layout with occupancy bars
- **Capacity Tracking**: See occupied vs. total capacity
- **Status Indicators**: Available/Full badges
- **Add/Delete Rooms**: Simple management

### 💰 Fee Management
- **Payment Tracking**: Mark fees as Paid/Unpaid
- **Revenue Statistics**: Total paid, unpaid, revenue
- **Fee Table**: Complete overview of all students
- **One-Click Payment**: Mark as paid instantly

### 📝 Complaint System
- **Submit Complaints**: Students can report issues
- **Category Icons**: Water, Electricity, Cleaning, Maintenance
- **Status Filtering**: All, Pending, Resolved
- **Admin Resolution**: Mark complaints as resolved
- **Visual Cards**: Beautiful complaint display

### 📈 Advanced Analytics (NEW!)
- **Interactive Charts**: Line, Bar, and Pie charts
- **Revenue Trends**: Monthly revenue visualization
- **Fee Collection**: Paid vs. Unpaid pie chart
- **Room Occupancy**: Bar chart showing usage
- **Complaint Stats**: Resolution metrics
- **PDF Export**: Generate reports for all data

### 📄 PDF Report Generation (NEW!)
- **Student Reports**: Complete student list
- **Fee Reports**: Payment status and revenue
- **Complaint Reports**: Issue tracking
- **Monthly Summaries**: Comprehensive overview
- **Professional Format**: Tables with headers

---

## 🚀 How to Run

### Prerequisites
- Node.js installed (v20+)

### Installation & Running

1. **Navigate to project**:
   ```bash
   cd "c:/Users/abdiq/Downloads/hostel managment sytem/hostel-nextjs"
   ```

2. **Install dependencies** (if not done):
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start development server**:
   
   **Option A** - Double-click `start.bat`
   
   **Option B** - PowerShell:
   ```powershell
   & "C:\Program Files\nodejs\npm.cmd" run dev
   ```

4. **Open browser**:
   ```
   http://localhost:3000
   ```

---

## 🔑 Login Credentials

### Admin Access
- **Username**: ``
- **Password**: ``
- **Capabilities**: Full system access, manage all features

### Student Access
- **Student IDs**: `STU001`, `STU002`, `STU003`
- **Password**: `student123`
- **Capabilities**: View dashboard, submit complaints

---

## 🛠️ Technology Stack

### Core
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **React 18** - Latest React features

### Styling
- **Tailwind CSS** - Utility-first styling
- **Custom Glassmorphism** - Frosted glass effects
- **Lucide React** - Modern icon library

### Advanced Features
- **Recharts** - Interactive data visualization
- **jsPDF** - PDF report generation
- **jsPDF-AutoTable** - Table formatting
- **date-fns** - Date formatting utilities

### Data Management
- **localStorage** - Client-side persistence
- **TypeScript Interfaces** - Type-safe data models

---

## 📁 Project Structure

```
hostel-nextjs/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx          # Login page
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Dashboard layout with sidebar
│   │   ├── dashboard/
│   │   │   ├── page.tsx            # Main dashboard
│   │   │   ├── students/page.tsx   # Student management
│   │   │   ├── rooms/page.tsx      # Room management
│   │   │   ├── fees/page.tsx       # Fee management
│   │   │   ├── complaints/page.tsx # Complaint system
│   │   │   └── analytics/page.tsx  # Analytics & reports
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles
├── lib/
│   ├── utils.ts                    # Utility functions
│   ├── data-store.ts               # Data management
│   └── pdf-generator.ts            # PDF generation
├── types/
│   └── index.ts                    # TypeScript types
├── package.json                    # Dependencies
├── tailwind.config.ts              # Tailwind configuration
└── tsconfig.json                   # TypeScript configuration
```

---

## 🎯 For University Defense

### Why This Impresses Evaluators

1. **Modern Tech Stack** ✅
   - Next.js 14 (industry standard)
   - TypeScript (professional development)
   - Latest React features

2. **Advanced Features** ✅
   - Interactive charts and analytics
   - PDF report generation
   - Real-time data visualization

3. **Professional Architecture** ✅
   - Component-based design
   - Type-safe code
   - Organized file structure

4. **Best Practices** ✅
   - Follows Next.js conventions
   - Reusable components
   - Clean code organization

5. **Scalability** ✅
   - Easy to add database (Prisma + PostgreSQL)
   - API routes ready
   - Modular design

6. **User Experience** ✅
   - Beautiful glassmorphic UI
   - Smooth animations
   - Responsive design

---

## 📊 Features Comparison

| Feature | HTML Version | Next.js Version |
|---------|-------------|-----------------|
| Framework | None | Next.js 14 ✅ |
| Type Safety | No | TypeScript ✅ |
| Components | Manual | React Components ✅ |
| Charts | No | Recharts ✅ |
| PDF Reports | No | jsPDF ✅ |
| Routing | Manual | Next.js Router ✅ |
| Build System | No | Webpack/Turbopack ✅ |
| Production Ready | Limited | Yes ✅ |
| Database Ready | No | Yes ✅ |

---

## 🎨 Design Features

- **Glassmorphism**: Frosted glass effects with backdrop blur
- **Gradient Backgrounds**: Animated purple/pink gradients
- **Smooth Animations**: Fade-in effects on page load
- **Responsive Layout**: Works on all screen sizes
- **Dark Theme**: Professional dark mode design
- **Custom Scrollbars**: Styled scrollbars

---

## 📝 Sample Data

The system comes pre-loaded with:
- **3 Students**: Ahmed Ali, Fatima Hassan, Mohamed Omar
- **5 Rooms**: R101-R105 with varying capacities
- **2 Complaints**: Sample pending and resolved complaints

---

## 🔄 Future Enhancements

Ready to add:
- **Database Integration**: Prisma + PostgreSQL
- **Real Backend API**: Next.js API routes
- **Authentication**: JWT tokens, sessions
- **Email Notifications**: Fee reminders, complaint updates
- **File Uploads**: Student photos, documents
- **Advanced Reports**: Custom date ranges, filters
- **Multi-language**: English, Arabic, Somali

---

## 🆘 Troubleshooting

**Issue**: npm not recognized
- **Solution**: Use `start.bat` or full path to npm

**Issue**: Port 3000 in use
- **Solution**: Change port: `npm run dev -- -p 3001`

**Issue**: Charts not showing
- **Solution**: Ensure recharts installed: `npm install recharts`

---

## 📞 Support

For issues or questions during your defense preparation, refer to:
- Implementation Plan: `implementation_plan.md`
- Quick Start Guide: `QUICK-START.md`

---

## 🏆 Success Tips for Defense

1. **Demo Flow**:
   - Start with login → Dashboard
   - Show student CRUD operations
   - Display analytics charts
   - Generate PDF reports
   - Demonstrate complaint system

2. **Highlight**:
   - TypeScript type safety
   - Component reusability
   - Modern architecture
   - Professional UI/UX

3. **Explain**:
   - Why Next.js over vanilla HTML
   - Benefits of TypeScript
   - Scalability for future features

---

**Built with ❤️ for University Excellence**

*This project demonstrates professional-grade web development suitable for graduation defense and real-world applications.*
