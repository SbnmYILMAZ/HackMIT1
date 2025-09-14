# QuizMaster 🧠

**An Interactive Learning Platform for Creating and Taking Quizzes**

QuizMaster is a modern, accessible educational platform built with Next.js that enables users to create custom quizzes, track their learning progress, and engage with interactive content. The platform features a beautiful cyberpunk-inspired UI, comprehensive admin analytics, and robust accessibility support.

> **Development Status:** This is an active development project. Some features are fully implemented while others are in prototype/mock stage.

[![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.9-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## ✨ Features

### 🎯 Core Functionality
- **Custom Quiz Creation**: Paste your notes and instantly generate personalized quizzes
- **Interactive Quiz Taking**: Engaging quiz interface with multiple question types
- **Progress Tracking**: Comprehensive analytics with badges, streaks, and performance metrics
- **Subject Organization**: Categorized quizzes (Mathematics, Physics, General Knowledge)
- **Difficulty Levels**: Easy, Medium, and Hard difficulty settings

### 🎨 User Experience
- **Modern Cyberpunk UI**: Beautiful gradient animations and neon effects
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Theme**: Eye-friendly dark interface with purple/pink accent colors
- **Smooth Animations**: CSS animations and transitions for enhanced UX

### ♿ Accessibility
- **Voice Navigation**: Navigate and answer quizzes using voice commands
- **Keyboard Navigation**: Full keyboard accessibility support
- **Screen Reader Support**: ARIA labels and semantic HTML structure
- **Skip Navigation**: Quick navigation links for assistive technologies

### 👥 User Management
- **Authentication System**: Secure user registration and login via Supabase Auth
- **Role-Based Access**: Admin dashboard for platform management
- **User Profiles**: Personalized user profiles with progress tracking
- **Session Management**: Secure session handling with automatic refresh

### 📊 Analytics & Admin
- **Real-time Dashboard**: Live analytics for user engagement and quiz performance
- **Admin Panel**: Comprehensive admin interface with user and quiz management
- **Performance Metrics**: Detailed charts and statistics using Recharts
- **System Monitoring**: Server uptime and performance tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or later
- pnpm (recommended) or npm
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Configure your `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migrations (see Database Schema section)
   - Configure authentication providers if needed

5. **Start the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI primitives with custom styling
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Charts**: Recharts for analytics visualization
- **Icons**: Lucide React
- **Fonts**: Geist Sans and Geist Mono

### Project Structure
```
frontend/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── auth/              # Authentication pages
│   ├── catalog/           # Quiz catalog page
│   ├── quiz/              # Individual quiz pages
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Landing page
├── components/            # Reusable React components
│   ├── ui/               # Base UI components (buttons, cards, etc.)
│   ├── admin-*.tsx       # Admin-specific components
│   ├── auth-*.tsx        # Authentication components
│   └── dashboard-*.tsx   # Dashboard components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries and configurations
│   ├── api/              # API client functions
│   ├── auth/             # Authentication helpers
│   ├── database/         # Database operations
│   └── supabase/         # Supabase client configuration
├── public/               # Static assets
└── styles/               # Global CSS styles
```

### Key Components

#### Authentication System
- **AuthProvider**: Context provider for authentication state
- **AuthGuard**: Route protection component
- **AuthStatus**: Real-time authentication status indicator
- **SessionTimer**: Session duration tracking

#### Dashboard System
- **DashboardLayout**: Main authenticated layout with navigation
- **AdminDashboard**: Analytics and management interface
- **UserFeedback**: Toast notification system
- **LoadingScreen**: Animated loading states

#### Quiz System
- **QuizCatalog**: Browse and filter available quizzes
- **QuizCreator**: Interface for creating new quizzes
- **QuizTaker**: Interactive quiz-taking interface
- **ProgressTracker**: User progress and statistics

## 🗄️ Database Schema

The application uses Supabase with the following main tables:

### Core Tables
- **profiles**: User profile information and preferences
- **quizzes**: Quiz metadata, subjects, and difficulty levels
- **questions**: Individual quiz questions with multiple choice options
- **attempts**: User quiz attempts and scores
- **user_progress**: Learning progress and achievement tracking

### Key Relationships
- Users have many quiz attempts
- Quizzes belong to users (creators)
- Questions belong to quizzes
- Attempts track user performance on specific quizzes

## 🎨 UI/UX Design

### Design System
- **Color Palette**: Purple/pink gradients with cyan accents
- **Typography**: Geist font family for modern readability
- **Spacing**: Consistent 8px grid system
- **Animations**: Smooth transitions and hover effects
- **Accessibility**: WCAG 2.1 AA compliance

### Component Library
Built on Radix UI primitives with custom styling:
- Buttons with gradient effects and hover animations
- Cards with border glow effects
- Form inputs with focus states
- Modals and dialogs with backdrop blur
- Progress indicators and loading states

## 🔧 Development

### Available Scripts
```bash
# Development server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Linting
pnpm lint

# Type checking
pnpm type-check
```

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with Next.js recommended rules
- **Prettier**: Code formatting (if configured)
- **Husky**: Git hooks for pre-commit checks (if configured)

### Environment Variables
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_vercel_analytics_id
```

## 📱 Features in Detail

### Quiz Creation
- Paste study materials to auto-generate questions
- Select subject categories and difficulty levels
- Add custom questions with multiple choice answers
- Preview and edit before publishing

### Quiz Taking
- Interactive question interface
- Real-time progress tracking
- Voice command support for accessibility
- Immediate feedback and explanations

### Progress Tracking
- Personal dashboard with statistics
- Achievement badges and learning streaks
- Performance analytics and improvement suggestions
- Subject-specific progress tracking

### Admin Dashboard
- User management and analytics
- Quiz moderation and content management
- System performance monitoring
- Real-time activity feeds

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Environment Setup
Ensure all environment variables are configured in your deployment platform:
- Supabase URL and API keys
- Any third-party service credentials
- Analytics tracking IDs

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the coding standards
4. Test your changes thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Coding Standards
- Use TypeScript for all new code
- Follow the existing component structure
- Add proper error handling and loading states
- Include accessibility attributes (ARIA labels, etc.)
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Radix UI** for accessible component primitives
- **Tailwind CSS** for utility-first styling
- **Supabase** for backend infrastructure
- **Vercel** for hosting and analytics
- **Lucide** for beautiful icons

## 📞 Support

For support, questions, or feature requests:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

---

**Built with ❤️ for learners worldwide**

*QuizMaster - Empowering education through interactive learning*
