# 🏥 نظام إدارة العيادة الطبية | Medical Clinic Management Dashboard

نظام شامل لإدارة العيادات الطبية مع التحكم في الأدوار والدعم متعدد اللغات (عربي/إنجليزي) وتصميم عصري متجاوب.

A comprehensive medical clinic management system with role-based access control, multilingual support (Arabic/English), and modern responsive design.

## 🔐 بيانات تسجيل الدخول | Login Credentials

بعد تشغيل سكريبت البيانات الوهمية، يمكنك استخدام:
After running the seed script, you can use:

### مدير النظام | Admin
- **البريد الإلكتروني | Email:** admin@clinic.com
- **كلمة المرور | Password:** admin123

### طبيب 1 | Doctor 1
- **البريد الإلكتروني | Email:** doctor1@clinic.com
- **كلمة المرور | Password:** doctor123

### طبيب 2 | Doctor 2
- **البريد الإلكتروني | Email:** doctor2@clinic.com
- **كلمة المرور | Password:** doctor123

### موظف الاستقبال | Receptionist
- **البريد الإلكتروني | Email:** receptionist@clinic.com
- **كلمة المرور | Password:** receptionist123

## 🏗️ معمارية المشروع | Architecture

هذا المشروع يحتوي على:
This project consists of:

- **Frontend**: React + TailwindCSS + shadcn/ui + i18n
- **Backend**: Node.js + Express + JWT + MongoDB (في نفس المجلد)
- **Serverless**: Functions for WhatsApp integration (Twilio)

## 🎯 المميزات | Features

### الأدوار والصلاحيات | Authentication & Roles
- **Super Admin**: إدارة كاملة للنظام | Full system management
- **Doctor**: إدارة المرضى والعلاج | Patient management and treatment
- **Receptionist**: تسجيل المرضى والمواعيد | Patient registration and scheduling
- **Patient**: عرض المواعيد والتمارين (مستقبلاً) | View appointments and exercises (future)

### الوظائف الأساسية | Core Functionality
- لوحة تحكم متجاوبة مع شريط جانبي | Responsive dashboard with sidebar navigation
- إدارة المرضى (إنشاء، قراءة، تحديث، حذف) | Patient management (CRUD)
- إدارة الأطباء والموظفين | Doctor and employee management
- جدولة المواعيد | Appointment scheduling
- تتبع المدفوعات | Payment tracking
- إدارة الجلسات مع التمارين | Session management with exercises
- إشعارات واتساب (serverless) | WhatsApp notifications (serverless)

### التصميم | Design
- واجهة عصرية مع لمسات ذهبية | Modern UI with gold accents
- متجاوب بالكامل (سطح المكتب، تابلت، موبايل) | Fully responsive (desktop, tablet, mobile)
- تبديل اللغة عربي/إنجليزي | Arabic/English language toggle
- تنقل الشريط الجانبي حسب الدور | Role-based sidebar navigation

## 🚀 البدء السريع | Quick Start

### المتطلبات | Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Twilio account (for WhatsApp)

### التثبيت | Installation

1. **استنساخ وإعداد المشروع | Clone and setup**
```bash
git clone <repository>
cd dasbord
```

2. **تثبيت التبعيات | Install dependencies**
```bash
npm install
```

3. **إضافة البيانات الوهمية | Add sample data**
```bash
npm run seed
```

4. **تشغيل المشروع | Run the project**
```bash
# تشغيل الباك اند والفرونت اند معاً | Run both backend and frontend
npm run dev:full

# أو تشغيل كل منهما منفصلاً | Or run them separately
npm run server  # الباك اند على المنفذ 5000 | Backend on port 5000
npm run dev     # الفرونت اند على المنفذ 5173 | Frontend on port 5173
```

5. **فتح التطبيق | Open the application**
- الواجهة الأمامية | Frontend: http://localhost:5173
- API الخلفي | Backend API: http://localhost:5000

6. **متغيرات البيئة | Environment Variables**
المشروع مُعد مسبقاً مع قاعدة بيانات MongoDB Atlas
The project is pre-configured with MongoDB Atlas database

## 📁 هيكل المشروع | Project Structure

```
dasbord/
├── 📁 public/                  # ملفات عامة | Static files
├── 📁 src/                     # تطبيق React الأمامي | React frontend
│   ├── 📁 components/          # مكونات React | React components
│   │   ├── 📁 UI/              # مكونات واجهة المستخدم | UI components
│   │   └── 📁 Layout/          # مكونات التخطيط | Layout components
│   ├── 📁 pages/               # صفحات التطبيق | Application pages
│   │   ├── 📁 Auth/            # صفحات المصادقة | Authentication pages
│   │   ├── 📁 Dashboard/       # لوحة التحكم | Dashboard
│   │   ├── 📁 Patients/        # إدارة المرضى | Patient management
│   │   ├── 📁 Doctors/         # إدارة الأطباء | Doctor management
│   │   ├── 📁 Sessions/        # إدارة الجلسات | Session management
│   │   ├── 📁 Payments/        # إدارة المدفوعات | Payment management
│   │   ├── 📁 Calendar/        # التقويم | Calendar
│   │   ├── 📁 Reports/         # التقارير | Reports
│   │   ├── 📁 Settings/        # الإعدادات | Settings
│   │   ├── 📁 Profile/         # الملف الشخصي | Profile
│   │   └── 📁 Error/           # صفحات الأخطاء | Error pages
│   ├── 📁 contexts/            # React Contexts
│   ├── 📁 services/            # خدمات API | API services
│   ├── 📁 utils/               # دوال مساعدة | Utility functions
│   └── 📁 i18n/                # ملفات الترجمة | Translation files
├── 📁 server/                  # خادم Node.js الخلفي | Node.js backend
│   ├── 📁 models/              # نماذج MongoDB | MongoDB models
│   ├── 📁 routes/              # مسارات API | API routes
│   ├── 📁 middleware/          # دوال الوسطاء | Express middleware
│   ├── 📁 config/              # إعدادات الخادم | Server configuration
│   └── 📁 scripts/             # سكريبتات مساعدة | Helper scripts
├── 📄 package.json             # تبعيات المشروع | Project dependencies
├── 📄 vite.config.js           # إعدادات Vite | Vite configuration
├── 📄 tailwind.config.js       # إعدادات TailwindCSS | TailwindCSS config
├── 📄 .env                     # متغيرات البيئة | Environment variables
└── 📄 README.md                # وثائق المشروع | Project documentation
```

## 🌐 Deployment

### Vercel (Recommended)
- Frontend: Deploy from `/frontend` directory
- Backend: Deploy as Vercel API routes
- Serverless: Auto-deployed with backend

### AWS Lambda
- Use Serverless Framework
- Deploy functions individually

## 📱 Mobile Support

The dashboard is fully responsive:
- **Desktop**: Full sidebar navigation
- **Tablet**: Collapsible sidebar
- **Mobile**: Hamburger menu dropdown

## 🌍 Internationalization

Supports Arabic and English with RTL/LTR layout switching.

## 🔐 Security

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Environment variable protection

## 📊 Database Schema

- Users (admin, doctor, receptionist)
- Patients (with assigned doctors)
- Sessions (appointments with exercises)
- Payments (tracking and history)
- Employees (categorized staff)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details.
