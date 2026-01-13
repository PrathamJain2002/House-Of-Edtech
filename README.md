# Task Manager - Full-Stack CRUD Application

A modern, secure, and user-friendly task management application built with Next.js 16 that helps users organize and manage their tasks efficiently. Features include authentication, AI-powered task suggestions, and a beautiful responsive UI.

## ✨ Features

- ✅ **Full CRUD Operations** - Create, Read, Update, and Delete tasks with robust validation
- 🔐 **Secure Authentication** - JWT-based authentication with NextAuth.js and password hashing
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS and shadcn/ui components
- 🤖 **AI-Powered Suggestions** - Smart task recommendations using GenAI (Google Gemini/OpenAI)
- 📱 **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- ♿ **Accessible** - Built with accessibility best practices (ARIA labels, keyboard navigation)
- 🚀 **Performance Optimized** - Server-side rendering, code splitting, and caching
- 🔒 **Security First** - Input validation, XSS protection, security headers, and data sanitization
- 🎯 **Task Management** - Filter by status/priority, search tasks, set due dates, and organize with tags

## 🛠️ Tech Stack

### Frontend/Backend
- **Next.js 16.1.1** - React framework with App Router
- **TypeScript** - Full type safety
- **React 19** - Latest React version

### Database
- **MongoDB** - NoSQL database
- **Mongoose 8** - Object Data Modeling

### Authentication
- **NextAuth.js v5** - Authentication framework
- **JWT** - Token-based sessions
- **bcryptjs** - Password hashing (12 rounds)

### UI/UX
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### Validation & Forms
- **Zod** - Schema validation
- **React Hook Form** - Form management

### Testing
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing
- **Playwright** - End-to-end testing

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd task-manager
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp env.example .env.local
```

Edit `.env.local` and configure:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/task-manager
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-manager

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# GenAI API Configuration (Optional - for AI features)
GENAI_API_KEY=your-genai-api-key
GENAI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
GENAI_MODEL=gemini-pro
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Set Up MongoDB

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/task-manager`

#### Option B: MongoDB Atlas (Recommended)
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist IP addresses (or use `0.0.0.0/0` for development)
5. Get connection string and update `MONGODB_URI`

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Create Your First Account

1. Navigate to the sign-up page
2. Create an account (you'll be automatically signed in)
3. Start creating and managing tasks!

## 📁 Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   └── tasks/        # Task CRUD endpoints
│   ├── auth/             # Auth pages (signin, signup)
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── Footer.tsx        # Footer component
│   ├── TasksPage.tsx     # Main tasks page
│   ├── TaskList.tsx      # Task list component
│   ├── TaskCard.tsx      # Individual task card
│   ├── TaskDialog.tsx    # Create/Edit task dialog
│   └── AISuggestionsDialog.tsx  # AI suggestions dialog
├── lib/
│   ├── mongodb.ts        # Database connection
│   ├── utils.ts          # Utility functions
│   ├── validations.ts    # Zod schemas
│   └── ai-helper.ts      # AI functionality
├── models/
│   ├── User.ts           # User model
│   └── Task.ts           # Task model
├── types/
│   └── next-auth.d.ts    # TypeScript definitions
├── hooks/
│   └── use-toast.ts      # Toast hook
└── middleware.ts         # Security middleware
```

## 🧪 Testing

Test infrastructure is configured and ready. Add your tests as needed:

```bash
# Unit tests (when tests are added)
npm test

# Watch mode
npm run test:watch

# E2E tests (when tests are added)
npm run test:e2e
```

## 🚢 Deployment

The application is configured for deployment on **Vercel** (recommended for Next.js) with CI/CD via GitHub Actions.

### Deploy to Vercel

Since this is a Next.js application with API routes (full-stack in one app), Vercel is the perfect choice:

1. Push your code to GitHub
2. Import repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

**Vercel automatically handles:**
- Frontend (React components)
- Backend (API routes in `/app/api`)
- Server-side rendering
- Automatic HTTPS
- Global CDN
- Zero configuration needed

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed step-by-step guide.

### Alternative: Other Platforms

You can also deploy to Render, Netlify, or other platforms. See [DEPLOYMENT.md](./DEPLOYMENT.md) for more options.

### Environment Variables for Production

Make sure to set all environment variables in your hosting platform:
- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (your production URL)
- `GENAI_API_KEY` (optional)
- `GENAI_API_URL` (optional)
- `GENAI_MODEL` (optional)

## 🔒 Security Features

- **Password Hashing** - bcrypt with 12 rounds
- **Input Validation** - Zod schema validation on all inputs
- **XSS Protection** - React's built-in escaping + security headers
- **CSRF Protection** - Next.js built-in protection
- **Security Headers** - HSTS, X-Frame-Options, CSP, etc.
- **User Data Isolation** - Users can only access their own tasks
- **Protected Routes** - Middleware-based route protection

See [SECURITY.md](./SECURITY.md) for detailed security documentation.

## 🎯 Key Features Explained

### Task Management
- Create tasks with title, description, status, priority, due date, and tags
- Filter tasks by status (To Do, In Progress, Completed) and priority (Low, Medium, High)
- Search tasks by title or description
- Edit and delete tasks with confirmation

### AI Features
- Get AI-powered task suggestions based on your existing tasks
- Smart task categorization
- Priority recommendations

### User Experience
- Auto sign-in after registration
- Toast notifications for all actions
- Loading states and error handling
- Responsive design for all devices

## 📚 Documentation

- **[README.md](./README.md)** - This file
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guide
- **[SECURITY.md](./SECURITY.md)** - Security considerations and best practices

## 🤝 Contributing

This is a project submission. For questions or issues, please contact the author.

## 📝 License

This project is created for educational/demonstration purposes.

## 👤 Author

**Pratham**

- GitHub: [@PrathamJain2002](https://github.com/PrathamJain2002)
- LinkedIn: [Pratham Jain](https://www.linkedin.com/in/pratham-jain-173622214/)

---

Built with ❤️ using Next.js 16, TypeScript, and MongoDB
