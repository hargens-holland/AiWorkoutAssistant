'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, RotateCcw } from 'lucide-react';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your FitSmith AI assistant. I can help you modify your workout and meal plans. Try saying something like 'move leg day to Friday' or 'exclude dairy from my meals'.",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputText),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('leg day') && input.includes('friday')) {
      return "I've moved your leg day workout to Friday! The schedule has been updated to avoid back-to-back heavy lower body days. Check your plan to see the changes.";
    }
    
    if (input.includes('dairy') || input.includes('exclude')) {
      return "I've updated your meal plan to exclude dairy products. I've replaced dairy items with suitable alternatives while maintaining your macro targets. Your shopping list has also been updated.";
    }
    
    if (input.includes('shorten') || input.includes('30 min')) {
      return "I've shortened your Thursday workout to 30 minutes by adjusting the number of sets and exercises while keeping the same focus areas. The plan maintains effectiveness within the shorter timeframe.";
    }
    
    if (input.includes('swap') && (input.includes('wednesday') || input.includes('friday'))) {
      return "I've swapped your Wednesday and Friday workouts as requested. This gives you better recovery time between similar muscle group workouts.";
    }
    
    return "I understand you'd like to modify your plan. I can help with:\n• Moving workouts to different days\n• Adjusting workout duration\n• Modifying dietary restrictions\n• Swapping workout days\n\nPlease be more specific about what you'd like to change.";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages([{
      id: '1',
      text: "Hi! I'm your FitSmith AI assistant. I can help you modify your workout and meal plans. Try saying something like 'move leg day to Friday' or 'exclude dairy from my meals'.",
      isUser: false,
      timestamp: new Date()
    }]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Chat Assistant</h1>
          <p className="text-gray-600">Modify your plans through natural conversation</p>
        </div>
        <Button variant="outline" onClick={resetChat} className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset Chat
        </Button>
      </div>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            Plan Modifications
          </CardTitle>
          <CardDescription>
            Ask me to modify your workout or meal plans
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isUser ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Try: 'move leg day to Friday' or 'exclude dairy from meals'"
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputText.trim() || isLoading}
              className="px-6"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Suggestions</CardTitle>
          <CardDescription>Try these common modifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              "Move leg day to Friday",
              "Shorten Thursday to 30 min",
              "Exclude dairy",
              "Swap Wednesday with Friday"
            ].map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInputText(suggestion)}
                className="text-xs h-auto py-2 px-3 text-left"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
