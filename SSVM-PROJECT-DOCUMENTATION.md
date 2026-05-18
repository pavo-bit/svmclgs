# 🎓 SSVM College Square - Complete Project Documentation

> **Modern School Management Platform with Gallery System**  
> **Last Updated:** May 11, 2026  
> **Status:** ✅ Production Ready

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Project Overview](#project-overview)
3. [Architecture](#architecture)
4. [Gallery System](#gallery-system)
5. [Features](#features)
6. [Technical Stack](#technical-stack)
7. [Docker Setup](#docker-setup)
8. [Connection Architecture](#connection-architecture)
9. [API Documentation](#api-documentation)
10. [Login Credentials](#login-credentials)
11. [Scripts & Commands](#scripts--commands)
12. [Troubleshooting](#troubleshooting)
13. [Project Structure](#project-structure)

---

## 🚀 Quick Start

### **3 Steps to Launch**

#### **Step 1: Start Docker Desktop**
- Open Docker Desktop application
- Wait for green icon in system tray (1-2 minutes)
- Verify it says "Docker Desktop is running"

#### **Step 2: Launch Platform**
```bash
# Windows - Double-click:
start-docker.bat

# Or manually:
docker compose up -d
```

#### **Step 3: Access Platform**
Wait 60 seconds, then open:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api/health
- **Admin Dashboard:** http://localhost:3000/login

---

## 📖 Project Overview

### **What is SSVM Platform?**
A complete school management system with:
- Modern responsive website
- Admin dashboard (14 management pages)
- Student/Parent/Alumni portals
- **Gallery system with 16 demo images**
- Events, notices, results, fees management
- JWT authentication & role-based access

### **Key Highlights**
✅ **Gallery System** - 16 professional demo images with admin control  
✅ **2-Container Architecture** - Application + Database  
✅ **Modern Design** - Dark theme with orange accents  
✅ **Fully Responsive** - Mobile-first design  
✅ **Cinematic Animations** - Framer Motion + GSAP  
✅ **TypeScript** - 100% type-safe  
✅ **Docker Ready** - One-command deployment  

---

## 🏗️ Architecture

### **2-Container Docker Setup**

```
┌─────────────────────────────────────────┐
│  Container 1: APPLICATION               │
│  ├─ Frontend (Next.js) - Port 3000     │
│  └─ Backend (Express.js) - Port 5000   │
└─────────────────────────────────────────┘
              ↕ (Docker Network)
┌─────────────────────────────────────────┐
│  Container 2: DATABASE                  │
│  └─ PostgreSQL 16 - Port 5432          │
└─────────────────────────────────────────┘
```

### **Connection Flow**

```
User Browser
    ↓
http://localhost:3000 (Frontend)
    ↓
http://localhost:5000 (Backend API)
    ↓
database:5432 (PostgreSQL via Docker Network)
```

### **Tech Stack**

**Frontend:**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- GSAP

**Backend:**
- Node.js 20
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL 16
- JWT Authentication
- Multer (file uploads)
- bcrypt (password hashing)

**DevOps:**
- Docker & Docker Compose
- Multi-stage builds
- Supervisord (process management)
- Health checks
- Persistent volumes

---

## 📸 Gallery System

### **Overview**
Complete photo gallery with admin control and 16 professional demo images.

### **Demo Images (16 Total)**

| Category | Count | Examples |
|----------|-------|----------|
| **Campus** | 4 | Main building, classrooms, garden |
| **Facilities** | 5 | Computer lab, science lab, library, art room, music room |
| **Events** | 3 | Sports day, cultural festival, independence day |
| **Academic** | 3 | Science exhibition, math workshop, chemistry lab |
| **Sports** | 2 | Basketball court, football ground |

### **Admin Features**
✅ Upload photos (max 5MB, JPG/PNG/GIF/WebP)  
✅ Add title, category, and description  
✅ Delete any image  
✅ Filter by 5 categories  
✅ Real-time updates  
✅ Image preview  

### **Public Features**
✅ Homepage gallery (8 images)  
✅ Category tabs for filtering  
✅ Hover effects with details  
✅ Responsive grid layout  
✅ Loading skeletons  
✅ Fallback images  

### **How to Use Gallery**

**As Visitor:**
1. Go to http://localhost:3000
2. Scroll to Gallery section
3. See 8 demo images
4. Click category tabs to filter
5. Hover over images for details

**As Admin:**
1. Login: `admin@ssvm-cuttack.org` / `admin123`
2. Click **Gallery** in sidebar
3. See all 16 demo images
4. Click **"+ Upload Photo"**
5. Fill form (title, category, image, description)
6. Click **"Upload Photo"** → Image appears!
7. Click **"Delete"** to remove images

### **Gallery API Endpoints**

```typescript
GET  /api/gallery              // Get all images
GET  /api/gallery?category=X   // Filter by category
POST /api/gallery              // Upload (Admin only)
DELETE /api/gallery/:id        // Delete (Admin only)
```

---

## ✨ Features

### **Website (Public)**
- Cinematic hero section with auto-rotating slides (3 slides, 6-second intervals)
- School statistics (3200+ students, 120+ faculty, 98% pass rate)
- Core values section
- Academic programs
- Events and notices (live from database)
- **Photo gallery with category filtering**
- Admission call-to-action
- Complete footer with links

### **Admin Dashboard (14 Pages)**
1. Dashboard - Overview with statistics
2. **Gallery Management** - Upload/delete photos
3. Students Management - CRUD operations
4. Faculty Management - Staff records
5. Parents Management - Parent accounts
6. Alumni Management - Alumni directory
7. Events Management - Create/edit events
8. Notices Management - Announcements
9. Assignments Management - Homework tracking
10. Results Management - Grades & marks
11. Fees Management - Payment tracking
12. Attendance Management - Daily attendance
13. Notifications - System notifications
14. Settings - Platform configuration

### **Student Portal**
- View results and grades
- Check assignments
- View attendance records
- See fee status
- Access notices and events

### **Parent Portal**
- Monitor children's progress
- View results and attendance
- Check fee payments
- Communicate with school
- Access notices

### **Alumni Portal**
- Browse alumni directory
- View contributions
- Network with other alumni
- Access events

---

## 🔐 Login Credentials

```
┌──────────────────────────────────────────────────────┐
│  ADMIN (Full Control)                                │
│  Email:    admin@ssvm-cuttack.org                    │
│  Password: admin123                                  │
│  Can: Upload/delete photos, manage all data          │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  STUDENT                                             │
│  Email:    student@ssvm-cuttack.org                  │
│  Password: student123                                │
│  Can: View results, assignments, attendance          │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  PARENT                                              │
│  Email:    parent@ssvm-cuttack.org                   │
│  Password: parent123                                 │
│  Can: Monitor children's progress                    │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  ALUMNI                                              │
│  Email:    alumni@ssvm-cuttack.org                   │
│  Password: alumni123                                 │
│  Can: Access alumni directory, contributions         │
└──────────────────────────────────────────────────────┘
```

---

## 🐳 Docker Setup

### **Files**
- `Dockerfile` - Multi-stage build for application
- `docker-compose.yml` - Service orchestration
- `.env` - Environment variables
- `.dockerignore` - Build optimization

### **Environment Variables (.env)**

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ssvm_platform

# Ports
FRONTEND_PORT=3000
BACKEND_PORT=5000
DATABASE_PORT=5432

# Security
JWT_SECRET=ssvm-college-square-jwt-secret-2025-change-in-production
JWT_EXPIRES_IN=7d
```

### **Docker Commands**

```bash
# Start containers
docker compose up -d

# View logs (all services)
docker compose logs -f

# View logs (specific service)
docker compose logs -f application
docker compose logs -f database

# Stop containers (keeps data)
docker compose down

# Stop and remove all data
docker compose down -v

# Rebuild containers
docker compose up -d --build

# Check container status
docker compose ps

# Access container shell
docker exec -it ssvm-application sh
docker exec -it ssvm-database sh

# Check resource usage
docker stats
```

---

## 🔗 Connection Architecture

### **Docker Network: ssvm-network**
- **Type:** Bridge network
- **Purpose:** Allows containers to communicate
- **DNS:** Containers reach each other by name

### **Container Names**
- `ssvm-application` - Frontend + Backend
- `ssvm-database` - PostgreSQL

### **Port Mappings**

| Service | Container Port | Host Port | Access From |
|---------|---------------|-----------|-------------|
| **Frontend** | 3000 | 3000 | Browser: http://localhost:3000 |
| **Backend** | 5000 | 5000 | Browser/Frontend: http://localhost:5000 |
| **Database** | 5432 | 5432 | Backend: database:5432<br>Host: localhost:5432 |

### **Connection Verification**

```bash
# Check containers are running
docker compose ps

# Test backend API
curl http://localhost:5000/api/health

# Test frontend
curl http://localhost:3000

# Test gallery API
curl http://localhost:5000/api/gallery

# Test database
docker exec ssvm-database pg_isready -U postgres

# Test backend-database connection
docker exec ssvm-application sh -c "cd /app/backend && npx prisma db execute --stdin <<< 'SELECT 1;'"
```

---

## 📡 API Documentation

### **Authentication**
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/me
```

### **Gallery**
```
GET    /api/gallery              // Get all images
GET    /api/gallery?category=X   // Filter by category
POST   /api/gallery              // Upload (Admin only)
DELETE /api/gallery/:id          // Delete (Admin only)
```

### **Events**
```
GET    /api/events
GET    /api/events/:id
POST   /api/events              // Admin only
PUT    /api/events/:id          // Admin only
DELETE /api/events/:id          // Admin only
```

### **Notices**
```
GET    /api/notices
GET    /api/notices/:id
POST   /api/notices             // Admin only
PUT    /api/notices/:id         // Admin only
DELETE /api/notices/:id         // Admin only
```

### **Students**
```
GET    /api/students
GET    /api/students/:id
POST   /api/students            // Admin only
PUT    /api/students/:id        // Admin only
DELETE /api/students/:id        // Admin only
```

### **Faculty**
```
GET    /api/faculty
GET    /api/faculty/:id
POST   /api/faculty             // Admin only
PUT    /api/faculty/:id         // Admin only
DELETE /api/faculty/:id         // Admin only
```

### **Results**
```
GET    /api/results
GET    /api/results/:studentId
POST   /api/results             // Admin only
```

### **Fees**
```
GET    /api/fees
GET    /api/fees/:studentId
POST   /api/fees                // Admin only
PUT    /api/fees/:id            // Admin only
```

### **Attendance**
```
GET    /api/attendance
GET    /api/attendance/:studentId
POST   /api/attendance          // Admin only
```

### **Assignments**
```
GET    /api/assignments
GET    /api/assignments/:id
POST   /api/assignments         // Admin only
POST   /api/assignments/:id/submit  // Student
```

### **Alumni**
```
GET    /api/alumni
GET    /api/alumni/:id
POST   /api/alumni              // Admin only
```

---

## 🛠️ Scripts & Commands

### **Helper Scripts**

| Script | Purpose |
|--------|---------|
| **start-docker.bat** | Quick start containers |
| **check-docker-status.bat** | Check if Docker is ready |
| **test-connections.bat** | Verify all connections |
| **WAIT-AND-START.bat** | Auto-wait and start |

### **start-docker.bat**
```batch
# Checks Docker, stops old containers, starts new ones
# Shows URLs and login credentials
# Usage: Double-click or run in terminal
```

### **check-docker-status.bat**
```batch
# Checks if Docker Desktop is ready
# Shows current containers if running
# Usage: Run before starting containers
```

### **test-connections.bat**
```batch
# Comprehensive connection test
# Tests: Docker, containers, backend, frontend, database, gallery
# Shows connection summary
# Usage: Run after containers are started
```

---

## 🚨 Troubleshooting

### **Problem: Docker Desktop won't start**

**Solution:**
1. Close Docker Desktop completely
2. Open Task Manager (Ctrl+Shift+Esc)
3. End all "Docker" processes
4. Restart Docker Desktop
5. Wait 2-3 minutes

### **Problem: "Port already in use"**

**Solution:**
```bash
# Find processes using ports
netstat -ano | findstr ":3000"
netstat -ano | findstr ":5000"
netstat -ano | findstr ":5432"

# Kill processes (replace <PID> with actual number)
taskkill /F /PID <PID>

# Then start containers
docker compose up -d
```

### **Problem: Containers won't start**

**Solution:**
```bash
# Complete reset
docker compose down -v
docker compose up -d --build
```

### **Problem: Frontend shows blank page**

**Solution 1:** Check logs
```bash
docker compose logs application | findstr "Frontend\|error"
```

**Solution 2:** Restart application
```bash
docker compose restart application
```

**Solution 3:** Wait longer (takes 1-2 minutes)
```bash
timeout /t 60
# Then refresh browser
```

### **Problem: Gallery images not showing**

**Solution 1:** Check backend
```bash
curl http://localhost:5000/api/gallery
```

**Solution 2:** Check database was seeded
```bash
docker compose logs application | findstr "Gallery seeded"
```

**Solution 3:** Reseed database
```bash
docker exec -it ssvm-application sh -c "cd /app/backend && npx tsx prisma/seed.ts"
```

### **Problem: Backend can't reach database**

**Solution:**
```bash
# Restart database
docker compose restart database

# Wait 30 seconds
timeout /t 30

# Restart application
docker compose restart application
```

### **Problem: Containers not on same network**

**Solution:**
```bash
# Recreate network and containers
docker compose down
docker compose up -d
```

---

## 📁 Project Structure

```
ssvm-college-square/
├── ssvm-backend/              # Express.js backend
│   ├── src/
│   │   ├── routes/           # API endpoints
│   │   │   ├── auth.ts       # Authentication
│   │   │   ├── gallery.ts    # Gallery API
│   │   │   ├── events.ts     # Events API
│   │   │   ├── notices.ts    # Notices API
│   │   │   ├── students.ts   # Students API
│   │   │   ├── faculty.ts    # Faculty API
│   │   │   ├── fees.ts       # Fees API
│   │   │   ├── results.ts    # Results API
│   │   │   ├── attendance.ts # Attendance API
│   │   │   ├── assignments.ts# Assignments API
│   │   │   ├── messages.ts   # Messages API
│   │   │   ├── alumni.ts     # Alumni API
│   │   │   └── cms.ts        # CMS API
│   │   ├── middleware/       # Auth middleware
│   │   │   └── auth.ts       # JWT verification
│   │   └── lib/              # Utilities
│   │       └── prisma.ts     # Prisma client
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema (20+ models)
│   │   └── seed.ts           # Demo data (16 gallery images!)
│   ├── uploads/              # Uploaded files
│   │   └── gallery/          # Gallery images
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── ssvm-platform/            # Next.js frontend
│   ├── src/
│   │   ├── app/              # Pages (App Router)
│   │   │   ├── page.tsx      # Homepage
│   │   │   ├── login/        # Login page
│   │   │   ├── admin/        # Admin dashboard
│   │   │   │   ├── page.tsx  # Dashboard
│   │   │   │   ├── gallery/  # Gallery management
│   │   │   │   ├── students/ # Students management
│   │   │   │   ├── faculty/  # Faculty management
│   │   │   │   ├── events/   # Events management
│   │   │   │   ├── notices/  # Notices management
│   │   │   │   └── ...       # Other admin pages
│   │   │   ├── student/      # Student portal
│   │   │   ├── parent/       # Parent portal
│   │   │   └── alumni/       # Alumni portal
│   │   ├── components/       # React components
│   │   │   ├── NewNavbar.tsx              # Navigation
│   │   │   ├── CinematicHeroSection.tsx   # Hero slider
│   │   │   ├── StatsSection.tsx           # Statistics
│   │   │   ├── CoreValuesSection.tsx      # Values
│   │   │   ├── AcademicProgramsSection.tsx# Programs
│   │   │   ├── EventsNoticesSection.tsx   # Events/Notices
│   │   │   ├── GallerySection.tsx         # Homepage gallery
│   │   │   ├── AdmissionCTASection.tsx    # CTA
│   │   │   ├── NewFooter.tsx              # Footer
│   │   │   ├── BackButton.tsx             # Navigation
│   │   │   └── DashboardLayout.tsx        # Admin layout
│   │   └── lib/              # Utilities
│   │       └── api-hooks.ts  # API hooks
│   ├── public/               # Static files
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── Dockerfile
│
├── Dockerfile                # Application container (multi-stage)
├── docker-compose.yml        # Service orchestration
├── .env                      # Environment variables
├── .dockerignore             # Build optimization
│
├── start-docker.bat          # Quick start script
├── check-docker-status.bat   # Docker status checker
├── test-connections.bat      # Connection test script
├── WAIT-AND-START.bat        # Auto-wait and start
│
└── SSVM-PROJECT-DOCUMENTATION.md  # This file
```

---

## 🌐 URLs Reference

| Service | URL | Description |
|---------|-----|-------------|
| **Homepage** | http://localhost:3000 | Main website with gallery |
| **Login** | http://localhost:3000/login | Login page |
| **Admin Dashboard** | http://localhost:3000/admin | Admin portal (after login) |
| **Admin Gallery** | http://localhost:3000/admin/gallery | Gallery management |
| **Student Portal** | http://localhost:3000/student | Student dashboard |
| **Parent Portal** | http://localhost:3000/parent | Parent dashboard |
| **Alumni Portal** | http://localhost:3000/alumni | Alumni dashboard |
| **Backend Health** | http://localhost:5000/api/health | API status check |
| **Gallery API** | http://localhost:5000/api/gallery | Gallery images JSON |
| **Events API** | http://localhost:5000/api/events | Events JSON |
| **Notices API** | http://localhost:5000/api/notices | Notices JSON |

---

## 📊 Statistics

```
Components:        30+
API Endpoints:     50+
Database Models:   20+
Admin Pages:       14
Demo Images:       16
User Roles:        4
Docker Containers: 2
Lines of Code:     ~15,000
Build Time:        ~5 minutes
Startup Time:      ~60 seconds
```

---

## ✅ Features Checklist

### **Gallery System**
- [x] 16 professional demo images
- [x] Admin upload control
- [x] Admin delete control
- [x] Category filtering (5 categories)
- [x] Homepage display
- [x] Responsive design
- [x] Real-time updates
- [x] Image optimization

### **Admin Dashboard**
- [x] Gallery management
- [x] Students management
- [x] Faculty management
- [x] Events & notices
- [x] Results & fees
- [x] Analytics

### **User Portals**
- [x] Student portal
- [x] Parent portal
- [x] Alumni portal

### **Technical**
- [x] Docker containerization
- [x] TypeScript (100%)
- [x] Authentication (JWT)
- [x] Database seeding
- [x] API documentation
- [x] Responsive design
- [x] Animations

---

## 🎯 Success Indicators

**Platform is working when:**

1. ✅ `docker compose ps` shows both containers "Up (healthy)"
2. ✅ http://localhost:3000 shows beautiful homepage
3. ✅ Gallery section visible with 8 images
4. ✅ Can login as admin
5. ✅ Admin gallery page shows 16 demo images
6. ✅ Can upload new photos
7. ✅ Can delete photos
8. ✅ Backend API responds: http://localhost:5000/api/health
9. ✅ Events and notices load from database
10. ✅ All portals accessible

---

## 📞 Support & Help

### **Quick Checks**
1. **Docker Ready?** Run: `check-docker-status.bat`
2. **Containers Running?** Run: `docker compose ps`
3. **Connections OK?** Run: `test-connections.bat`
4. **View Logs:** Run: `docker compose logs -f`

### **Common Solutions**
- **Reset Everything:** `docker compose down -v && docker compose up -d`
- **Rebuild:** `docker compose up -d --build`
- **Restart:** `docker compose restart`

---

## 🎉 Summary

**Your SSVM Platform is complete with:**

✅ Modern, responsive website  
✅ Complete admin dashboard (14 pages)  
✅ Student/Parent/Alumni portals  
✅ **Gallery with 16 demo images**  
✅ **Admin photo upload/delete control**  
✅ Events, notices, results, fees management  
✅ Authentication & security (JWT)  
✅ Docker containerization  
✅ TypeScript (100%)  
✅ Smooth animations  
✅ Mobile-first design  

**Just run `start-docker.bat` and explore!** 🚀

---

## 📝 License

This project is for SSVM College Square, Cuttack.

---

*Built with ❤️ for SSVM College Square*  
*Documentation Version: 1.0*  
*Last Updated: May 11, 2026*
