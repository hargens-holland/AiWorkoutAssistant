# FitSmith - AI-Powered Fitness & Meal Planner 🚴‍♂️🥗

A personal, free-tier web app that generates personalized workout plans and meal suggestions, syncs with Google Calendar, and adapts based on user feedback.

## ✨ Features

- **Smart Workout Planning**: AI-generated plans based on goals, equipment, and schedule
- **Meal Planning**: Personalized nutrition plans with shopping lists and macro tracking
- **Calendar Integration**: Automatic sync with Google Calendar
- **AI Chat Assistant**: Modify plans through natural conversation
- **Progress Tracking**: Weekly check-ins and adaptive planning
- **Responsive Design**: Beautiful UI built with Tailwind CSS and shadcn/ui

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel (free tier)
- **Calendar**: Google Calendar API
- **Testing**: Vitest (unit), Playwright (e2e)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Google OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd AIWorkoutAssistent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your credentials:
   ```env
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Pages & Features

### `/` - Home
- Hero section with call-to-action
- Feature overview
- Getting started guide

### `/onboarding` - User Setup
- Multi-step profile creation
- Goals and preferences setup
- Equipment and dietary restrictions

### `/dashboard` - Main Dashboard
- Today's workout and meal overview
- Weekly progress tracking
- Quick actions and navigation

### `/plan` - Weekly Plan
- Workout schedule with exercises
- Meal plans with macros
- Shopping list generation
- Calendar sync button

### `/chat` - AI Assistant
- Natural language plan modifications
- Quick suggestion buttons
- Real-time chat interface

### `/settings` - User Preferences
- Profile management
- Calendar integration
- Notification settings
- Data export/deletion

## 🗄️ Database Schema

The app uses Supabase with the following core tables:

- `users` - User authentication and basic info
- `user_profile` - Fitness profile and preferences
- `goals` - User fitness objectives
- `plans` - Weekly workout and meal plans
- `workouts` - Individual workout sessions
- `meals` - Meal planning data
- `logs` - Progress tracking and check-ins

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   ├── onboarding/     # User setup flow
│   ├── dashboard/      # Main dashboard
│   ├── plan/          # Weekly plans
│   ├── chat/          # AI chat interface
│   └── settings/      # User preferences
├── components/         # Reusable UI components
│   ├── ui/            # shadcn/ui components
│   ├── Navbar.tsx     # Main navigation
│   └── AuthProvider.tsx # Authentication context
├── lib/               # Utility functions
│   ├── supabase.ts    # Database client
│   └── auth.ts        # NextAuth configuration
└── types/             # TypeScript type definitions
    └── plan.ts        # Core data types
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Adding New Components

```bash
npx shadcn@latest add [component-name]
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests (when Playwright is set up)
npm run test:e2e
```

## 🚀 Deployment

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Set environment variables**
4. **Deploy automatically**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or issues:
- Check the [documentation](docs/)
- Open a [GitHub issue](issues/)
- Join our [Discord community](discord-link)

---

Built with ❤️ by the FitSmith team
