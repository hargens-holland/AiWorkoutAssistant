# 🚀 FitSmith Development Roadmap - Complete Step-by-Step Guide

## 📍 **Current Status**
- ✅ Frontend UI complete (all pages, components, styling)
- ✅ Next.js App Router structure
- ✅ NextAuth.js configured (but not connected)
- ❌ No working backend API routes
- ❌ No database setup
- ❌ No authentication working
- ❌ No AI agents implemented
- ❌ No real functionality

---

## 🎯 **Phase 1: Fix Authentication & Basic Setup (Steps 1-5)**

### **Step 1: Fix NextAuth Configuration**
**Goal:** Get basic authentication working without external dependencies
**What to do:**
- Comment out Supabase adapter in `src/lib/auth.ts`
- Configure basic NextAuth with Google OAuth (mock credentials for now)
- Test that auth pages load without errors
- Ensure server starts without authentication errors

**Files to modify:**
- `src/lib/auth.ts`
- `.env.local`

**Success criteria:** Server starts without errors, auth pages load

---

### **Step 2: Set Up Supabase Project**
**Goal:** Create and configure Supabase database
**What to do:**
- Create Supabase account at supabase.com
- Create new project
- Get project URL and API keys
- Update `.env.local` with real Supabase credentials
- Test database connection

**Files to modify:**
- `.env.local`

**Success criteria:** Can connect to Supabase, no connection errors

---

### **Step 3: Create Database Schema**
**Goal:** Set up all required database tables
**What to do:**
- Create SQL migration files for all tables:
  - `users` (id, email, name, created_at)
  - `user_profile` (user_id, sex, dob, height_cm, weight_kg, activity_level, dietary_prefs, equipment, timezone)
  - `goals` (id, user_id, goal_type, target_value, timeframe, constraints, status)
  - `plans` (id, user_id, goal_id, week_index, plan_json, created_at)
  - `workouts` (id, plan_id, user_id, date, start_time, title, details, status)
  - `meals` (id, plan_id, user_id, date, meal_type, details)
  - `logs` (id, user_id, date, weight_kg, pushups_max, calories_consumed, notes)
- Run migrations in Supabase
- Set up Row Level Security (RLS) policies
- Test table creation and basic operations

**Files to create:**
- `database/migrations/001_initial_schema.sql`
- `database/migrations/002_rls_policies.sql`

**Success criteria:** All tables exist, RLS policies working, can insert/query data

---

### **Step 4: Implement Basic API Routes**
**Goal:** Create working backend endpoints for core functionality
**What to do:**
- Create `/api/profile` route (GET, POST, PUT)
- Create `/api/goals` route (GET, POST, PUT)
- Create `/api/auth/session` route (if not handled by NextAuth)
- Test all routes with Postman/Thunder Client
- Ensure proper error handling and validation

**Files to create:**
- `src/app/api/profile/route.ts`
- `src/app/api/goals/route.ts`
- `src/lib/validators.ts` (Zod schemas)

**Success criteria:** All API routes return proper responses, handle errors gracefully

---

### **Step 5: Connect Frontend to Backend**
**Goal:** Make frontend forms actually save data
**What to do:**
- Update onboarding form to call `/api/profile`
- Update settings form to call `/api/profile`
- Add loading states and error handling
- Test complete user flow: signup → onboarding → dashboard
- Ensure data persists in database

**Files to modify:**
- `src/app/onboarding/page.tsx`
- `src/app/settings/page.tsx`
- `src/lib/api.ts` (API client functions)

**Success criteria:** User can complete onboarding, data saves to database, dashboard shows real user data

---

## 🧠 **Phase 2: Core Domain Logic (Steps 6-10)**

### **Step 6: Implement Macro Calculations**
**Goal:** Calculate user's daily calorie and macro needs
**What to do:**
- Create `src/domain/nutrition/macros.ts`
- Implement Mifflin-St Jeor BMR calculation
- Add activity factor multipliers
- Calculate goal-based calorie adjustments
- Implement macro distribution (protein, carbs, fat)
- Add unit tests for all calculations

**Files to create:**
- `src/domain/nutrition/macros.ts`
- `src/domain/nutrition/__tests__/macros.test.ts`

**Success criteria:** Can calculate accurate macros for any user profile, all tests pass

---

### **Step 7: Create Workout Templates**
**Goal:** Generate workout plans based on user goals and equipment
**What to do:**
- Create `src/domain/training/templates/`
- Implement templates: fullbody_3day, ul_4day, ppl_6day, pushup_progression, 5k_base
- Add exercise database with sets, reps, rest periods
- Create equipment-based exercise filtering
- Implement progressive overload logic
- Add validation for workout balance and rest days

**Files to create:**
- `src/domain/training/templates/index.ts`
- `src/domain/training/templates/fullbody_3day.ts`
- `src/domain/training/templates/ul_4day.ts`
- `src/domain/training/templates/ppl_6day.ts`
- `src/domain/training/exercises.ts`
- `src/domain/training/__tests__/templates.test.ts`

**Success criteria:** Can generate valid workout plans for any goal/equipment combination

---

### **Step 8: Implement Meal Planning**
**Goal:** Generate meal plans that hit macro targets
**What to do:**
- Create `src/domain/nutrition/mealplan.ts`
- Build recipe database with ingredients and macros
- Implement meal selection algorithm to hit targets
- Add dietary restriction filtering
- Create shopping list generation
- Implement meal timing optimization

**Files to create:**
- `src/domain/nutrition/mealplan.ts`
- `src/domain/nutrition/recipes.ts`
- `src/domain/nutrition/shoppingList.ts`
- `src/domain/nutrition/__tests__/mealplan.test.ts`

**Success criteria:** Can generate meal plans that hit macro targets within ±5%, handles dietary restrictions

---

### **Step 9: Create Weekly Plan Generator**
**Goal:** Combine workouts and meals into cohesive weekly plans
**What to do:**
- Create `src/domain/plan/generateWeeklyPlan.ts`
- Implement plan coordination logic
- Ensure workout and meal timing alignment
- Add validation rules (no back-to-back heavy leg days, etc.)
- Generate shopping lists
- Create plan JSON structure

**Files to create:**
- `src/domain/plan/generateWeeklyPlan.ts`
- `src/domain/plan/validators.ts`
- `src/domain/plan/__tests__/generateWeeklyPlan.test.ts`

**Success criteria:** Can generate valid 7-day plans with workouts, meals, and shopping lists

---

### **Step 10: Implement Plan Persistence**
**Goal:** Save and retrieve user plans from database
**What to do:**
- Create `/api/plan/generate` route
- Create `/api/plan/current` route
- Implement plan storage in database
- Add plan retrieval with user filtering
- Test plan generation and storage
- Ensure plans are user-specific and secure

**Files to create:**
- `src/app/api/plan/generate/route.ts`
- `src/app/api/plan/current/route.ts`
- `src/lib/planService.ts`

**Success criteria:** Can generate, save, and retrieve user plans from database

---

## 🤖 **Phase 3: AI Agent Implementation (Steps 11-15)**

### **Step 11: Create Chat Parser**
**Goal:** Parse natural language requests into structured actions
**What to do:**
- Create `src/domain/agents/ChatParser.ts`
- Implement regex patterns for common requests:
  - "move leg day to Friday"
  - "shorten Thursday to 30 min"
  - "exclude dairy"
  - "swap Wednesday with Friday"
- Add intent classification
- Create structured action objects
- Add validation for parsed requests

**Files to create:**
- `src/domain/agents/ChatParser.ts`
- `src/domain/agents/types.ts`
- `src/domain/agents/__tests__/ChatParser.test.ts`

**Success criteria:** Can parse all specified request types into structured actions

---

### **Step 12: Implement WorkoutPlanner Agent**
**Goal:** Handle workout-related modifications
**What to do:**
- Create `src/domain/agents/WorkoutPlanner.ts`
- Implement workout rescheduling logic
- Add duration modification
- Handle exercise substitutions
- Ensure workout balance and rest day rules
- Add validation for workout changes

**Files to create:**
- `src/domain/agents/WorkoutPlanner.ts`
- `src/domain/agents/__tests__/WorkoutPlanner.test.ts`

**Success criteria:** Can modify workout plans while maintaining fitness principles

---

### **Step 13: Implement MealPlanner Agent**
**Goal:** Handle meal-related modifications
**What to do:**
- Create `src/domain/agents/MealPlanner.ts`
- Implement dietary restriction handling
- Add meal substitution logic
- Recalculate macros after changes
- Update shopping lists
- Ensure nutritional balance

**Files to create:**
- `src/domain/agents/MealPlanner.ts`
- `src/domain/agents/__tests__/MealPlanner.test.ts`

**Success criteria:** Can modify meal plans while maintaining macro targets

---

### **Step 14: Create Agent Orchestrator**
**Goal:** Coordinate between all agents for complex requests
**What to do:**
- Create `src/domain/agents/Orchestrator.ts`
- Implement request routing logic
- Handle multi-agent coordination
- Manage plan consistency
- Add conflict resolution
- Implement rollback for failed modifications

**Files to create:**
- `src/domain/agents/Orchestrator.ts`
- `src/domain/agents/__tests__/Orchestrator.test.ts`

**Success criteria:** Can coordinate multiple agents for complex plan modifications

---

### **Step 15: Connect Chat to AI Agents**
**Goal:** Make chat interface actually modify plans
**What to do:**
- Create `/api/chat` route
- Connect chat parser to agent orchestrator
- Implement plan modification flow
- Add response generation
- Update frontend to show real modifications
- Test complete chat → modification flow

**Files to create:**
- `src/app/api/chat/route.ts`
- `src/lib/chatService.ts`

**Success criteria:** Chat can successfully modify plans and show real changes

---

## 🔄 **Phase 4: Integration & Polish (Steps 16-20)**

### **Step 16: Implement Google Calendar Sync**
**Goal:** Sync workouts and meals to user's Google Calendar
**What to do:**
- Set up Google Cloud project
- Get OAuth credentials
- Implement Google Calendar API integration
- Create `/api/calendar/sync` route
- Add calendar event creation
- Handle timezone conversion
- Test calendar sync functionality

**Files to create:**
- `src/app/api/calendar/sync/route.ts`
- `src/lib/calendarService.ts`
- `src/lib/googleAuth.ts`

**Success criteria:** Can create calendar events for workouts and meals

---

### **Step 17: Add Progress Tracking**
**Goal:** Track user progress and adapt plans
**What to do:**
- Create `/api/checkin/weekly` route
- Implement progress logging
- Add plan adaptation logic
- Create progress visualization
- Implement goal achievement tracking
- Add weekly check-in reminders

**Files to create:**
- `src/app/api/checkin/weekly/route.ts`
- `src/domain/progress/ProgressTracker.ts`
- `src/domain/progress/PlanAdapter.ts`

**Success criteria:** Can track progress and adapt plans based on user feedback

---

### **Step 18: Implement User Dashboard**
**Goal:** Show real user data and progress
**What to do:**
- Connect dashboard to real API endpoints
- Display current plan information
- Show progress charts and metrics
- Add quick actions (generate new plan, check-in, etc.)
- Implement responsive design improvements
- Add loading states and error handling

**Files to modify:**
- `src/app/dashboard/page.tsx`
- `src/components/Dashboard/` (new components)

**Success criteria:** Dashboard shows real user data, progress, and functional actions

---

### **Step 19: Add Form Validation & Error Handling**
**Goal:** Improve user experience with proper validation
**What to do:**
- Add Zod validation to all forms
- Implement proper error messages
- Add loading states
- Handle network errors gracefully
- Add success confirmations
- Implement form persistence

**Files to modify:**
- All form components
- `src/lib/validators.ts`

**Success criteria:** All forms have proper validation, error handling, and user feedback

---

### **Step 20: Final Testing & Bug Fixes**
**Goal:** Ensure app works end-to-end
**What to do:**
- Test complete user flow
- Fix any bugs or issues
- Optimize performance
- Add error boundaries
- Test edge cases
- Ensure responsive design works
- Add final polish and improvements

**Success criteria:** App works flawlessly from signup to plan generation to modifications

---

## 🎯 **Success Criteria for Complete App**

### **MVP Requirements Met:**
- ✅ User can sign in with Google OAuth
- ✅ User can complete onboarding and save profile
- ✅ App can generate personalized workout plans
- ✅ App can generate personalized meal plans
- ✅ User can modify plans via chat interface
- ✅ Plans sync to Google Calendar
- ✅ App adapts based on weekly check-ins
- ✅ All data persists in Supabase database

### **Technical Requirements Met:**
- ✅ TypeScript strict mode enabled
- ✅ All server code in route handlers
- ✅ Supabase RLS enabled
- ✅ Pure domain functions for testability
- ✅ shadcn/ui components with Tailwind
- ✅ Proper error handling and validation

---

## 🚀 **Next Steps**

1. **Start with Step 1** - Fix NextAuth configuration
2. **Work through each step sequentially**
3. **Test thoroughly at each step**
4. **Ask for help on any specific step**
5. **Celebrate when you reach the end!** 🎉

---

## 📚 **Resources & Dependencies**

### **Key Dependencies Already Installed:**
- Next.js 14, React, TypeScript
- Tailwind CSS, shadcn/ui
- NextAuth.js, Supabase client
- Zod for validation

### **Additional Dependencies to Add:**
- Google APIs client (for calendar)
- Date manipulation libraries
- Testing frameworks (Vitest, Playwright)

### **External Services to Set Up:**
- Supabase project
- Google Cloud project
- Google OAuth credentials

---

**Total Estimated Time:** 2-4 weeks depending on experience level
**Difficulty Level:** Intermediate to Advanced
**Prerequisites:** Basic React/Next.js knowledge, willingness to learn new concepts

---

*This roadmap will take you from a beautiful prototype to a fully functional AI-powered fitness app! 🏋️‍♂️🥗*
