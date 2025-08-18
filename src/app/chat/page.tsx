'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function ChatContent() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your AI fitness assistant. How can I help you today?", isAI: true }
  ]);
  const [inputValue, setInputValue] = useState('');

  const quickSuggestions = [
    "Move leg day to Friday",
    "I'm too tired for cardio today",
    "Suggest a quick 15-minute workout",
    "Help me modify my meal plan"
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = { id: Date.now(), text: inputValue, isAI: false };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const aiMessage = { id: Date.now() + 1, text: aiResponse, isAI: true };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('leg day') && input.includes('friday')) {
      return "I've moved your leg day to Friday! This gives you more recovery time between upper body and leg workouts. Your updated schedule is now optimized for better muscle recovery.";
    }
    
    if (input.includes('tired') || input.includes('exhausted')) {
      return "It's totally okay to feel tired! Let's do a lighter recovery workout today. How about some gentle stretching or a 20-minute walk? Remember, rest is just as important as exercise.";
    }
    
    if (input.includes('15 minute') || input.includes('quick')) {
      return "Here's a quick 15-minute full-body workout: 5 min warm-up, 3 rounds of 30s each: push-ups, squats, mountain climbers, and planks. Perfect for when you're short on time!";
    }
    
    if (input.includes('meal') || input.includes('food')) {
      return "I'd be happy to help modify your meal plan! What specific changes are you looking for? Are you trying to adjust calories, macros, or accommodate new dietary preferences?";
    }
    
    return "I understand you're asking about that. Let me help you with your fitness goals. Could you provide a bit more detail so I can give you the best possible advice?";
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Fitness Assistant</h1>
        <p className="text-gray-600">Chat with your AI to modify plans, get advice, and stay motivated</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Suggestions</CardTitle>
          <CardDescription>Click on a suggestion to start chatting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickSuggestion(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="h-96">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isAI
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <ChatContent />
    </ProtectedRoute>
  );
}
