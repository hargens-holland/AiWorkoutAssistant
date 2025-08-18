import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Utensils, Calendar, MessageSquare } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Your AI-Powered
          <span className="text-blue-600"> Fitness Companion</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Get personalized workout plans, meal suggestions, and expert guidance.
          Sync with your calendar and adapt based on your progress.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/onboarding">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/dashboard">View Demo</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="text-center">
            <Dumbbell className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle>Smart Workouts</CardTitle>
            <CardDescription>
              AI-generated plans based on your goals, equipment, and schedule
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Utensils className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <CardTitle>Meal Planning</CardTitle>
            <CardDescription>
              Personalized nutrition plans with shopping lists and macro tracking
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <CardTitle>Calendar Sync</CardTitle>
            <CardDescription>
              Automatically sync workouts and meals to Google Calendar
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <MessageSquare className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <CardTitle>AI Chat</CardTitle>
            <CardDescription>
              Modify plans through natural conversation
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 bg-blue-50 rounded-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Transform Your Fitness Journey?
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Join thousands of users who have achieved their fitness goals with FitSmith
        </p>
        <Button size="lg" asChild>
          <Link href="/onboarding">Start Your Free Plan</Link>
        </Button>
      </section>
    </div>
  );
}
