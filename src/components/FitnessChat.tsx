'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSession } from 'next-auth/react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface FitnessChatProps {
    onComplete: (extractedData: any) => void;
    onCancel: () => void;
}

export function FitnessChat({ onComplete, onCancel }: FitnessChatProps) {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hey there! 👋 I'm here to help you create a new fitness goal. Let's chat about what you want to achieve! What's your main fitness goal?",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [extractedData, setExtractedData] = useState<any>(null);
    const [conversationStage, setConversationStage] = useState<'goal' | 'details' | 'preferences' | 'complete'>('goal');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            // Simulate AI response for now (we'll add OpenAI integration next)
            const aiResponse = await simulateAIResponse(inputValue, conversationStage);

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);

            // Check if we have enough information to extract data
            if (shouldExtractData()) {
                const data = await extractFitnessData();
                setExtractedData(data);
                setConversationStage('complete');
            }

        } catch (error) {
            console.error('Error processing message:', error);

            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Sorry, I'm having trouble processing that right now. Can you try rephrasing?",
                timestamp: new Date()
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const simulateAIResponse = async (userInput: string, stage: string): Promise<string> => {
        try {
            // Call the OpenAI API
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, { role: 'user', content: userInput }],
                    conversationStage: stage
                }),
            });

            if (response.ok) {
                const data = await response.json();

                // Update conversation stage if needed
                if (data.conversationStage && data.conversationStage !== stage) {
                    setConversationStage(data.conversationStage);
                }

                return data.response;
            } else {
                throw new Error('Failed to get AI response');
            }
        } catch (error) {
            console.error('Error calling AI API:', error);

            // Fallback to simple responses if API fails
            const input = userInput.toLowerCase();

            if (stage === 'goal') {
                if (input.includes('lose weight') || input.includes('weight loss')) {
                    setConversationStage('details');
                    return "Great goal! Weight loss is totally achievable. How much weight are you looking to lose, and what's your timeline? (e.g., '20 pounds in 3 months')";
                }

                if (input.includes('gain muscle') || input.includes('muscle')) {
                    setConversationStage('details');
                    return "Awesome! Building muscle is a great goal. What's your current strength level? And what's your target? (e.g., 'bench 225 pounds')";
                }

                if (input.includes('get in shape') || input.includes('fitness')) {
                    setConversationStage('details');
                    return "Love that! What does 'getting in shape' mean to you specifically? Are you thinking more energy, better endurance, or something measurable?";
                }

                if (input.includes('run') || input.includes('endurance')) {
                    setConversationStage('details');
                    return "Great endurance goal! What distance or time are you aiming for? (e.g., 'run a 5k', 'improve mile time')";
                }

                return "That's interesting! Tell me more about your specific goal. What would success look like for you? Try to be as specific as possible!";
            }

            if (stage === 'details') {
                if (input.includes('pound') || input.includes('lb') || input.includes('kg')) {
                    setConversationStage('preferences');
                    return "Perfect! Now let's talk about your setup. What equipment do you have access to? (gym, home weights, just bodyweight exercises?)";
                }

                if (input.includes('bench') || input.includes('squat') || input.includes('deadlift')) {
                    setConversationStage('preferences');
                    return "Great strength goal! What equipment do you have access to? (gym membership, home rack, or need to find alternatives?)";
                }

                if (input.includes('5k') || input.includes('mile') || input.includes('time')) {
                    setConversationStage('preferences');
                    return "Excellent! Now let's talk about your training setup. Do you have access to a track, treadmill, or just outdoor running?";
                }

                return "I need a bit more detail to understand your goal. Can you give me a specific target or measurement?";
            }

            if (stage === 'preferences') {
                if (input.includes('equipment') || input.includes('weights') || input.includes('gym')) {
                    return "Perfect! Now for your schedule - how many days a week can you realistically commit to working out? And what's your preferred time - mornings, evenings, or flexible?";
                }

                if (input.includes('schedule') || input.includes('time') || input.includes('days')) {
                    return "Great! One last thing - what's your current fitness experience level? (beginner, intermediate, advanced) And any dietary preferences or restrictions I should know about?";
                }

                return "Thanks! Now let's talk about your schedule. How many days a week can you work out?";
            }

            return "That's helpful! Tell me more about your preferences and setup.";
        }
    };

    const shouldExtractData = (): boolean => {
        // Check if we have enough info for goal creation
        const messageCount = messages.length;
        const hasGoal = messages.some(m =>
            m.content.toLowerCase().includes('lose') ||
            m.content.toLowerCase().includes('gain') ||
            m.content.toLowerCase().includes('fitness') ||
            m.content.toLowerCase().includes('run') ||
            m.content.toLowerCase().includes('bench')
        );
        const hasEquipment = messages.some(m =>
            m.content.toLowerCase().includes('equipment') ||
            m.content.toLowerCase().includes('gym') ||
            m.content.toLowerCase().includes('weights') ||
            m.content.toLowerCase().includes('bodyweight')
        );
        const hasSchedule = messages.some(m =>
            m.content.toLowerCase().includes('days') ||
            m.content.toLowerCase().includes('schedule') ||
            m.content.toLowerCase().includes('time')
        );

        return messageCount >= 8 && hasGoal && hasEquipment && hasSchedule;
    };

    const extractFitnessData = async (): Promise<any> => {
        try {
            // Use AI to extract structured data from the conversation
            const response = await fetch('/api/ai/extract-goal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('AI extracted data:', data.extractedData);
                return data.extractedData;
            } else {
                throw new Error('Failed to extract data with AI');
            }
        } catch (error) {
            console.error('Error extracting data with AI, falling back to simple extraction:', error);

            // Fallback to simple extraction if AI fails
            const allText = messages.map(m => m.content).join(' ');
            const text = allText.toLowerCase();

            // Extract basic information
            const data: any = {
                title: 'Fitness Goal',
                description: 'Personal fitness goal',
                type: 'general_fitness',
                target: 'Improve fitness',
                timeframe: '3 months',
                workoutDays: ['monday', 'wednesday', 'friday'],
                availableEquipment: ['bodyweight'],
                experienceLevel: 'beginner',
                dietaryRestrictions: [],
                workoutDuration: 45,
                workoutTime: 'evening'
            };

            // Extract goal type and target
            if (text.includes('lose weight') || text.includes('weight loss')) {
                data.type = 'weight_loss';
                if (text.includes('20') || text.includes('twenty')) {
                    data.target = 'Lose 20 pounds';
                    data.currentWeight = 0; // Will need user input
                    data.targetWeight = 20;
                }
            }

            if (text.includes('gain muscle') || text.includes('muscle')) {
                data.type = 'muscle_gain';
                if (text.includes('bench') && text.includes('225')) {
                    data.target = 'Bench 225 pounds';
                    data.currentBench = 0; // Will need user input
                    data.targetBench = 225;
                }
            }

            if (text.includes('run') || text.includes('5k')) {
                data.type = 'endurance';
                if (text.includes('5k')) {
                    data.target = 'Run a 5k';
                    data.currentMileTime = '0'; // Will need user input
                    data.targetMileTime = '25:00';
                }
            }

            // Extract equipment
            if (text.includes('dumbbell') || text.includes('weights')) {
                data.availableEquipment = ['dumbbells'];
            }
            if (text.includes('gym')) {
                data.availableEquipment = ['gym_access'];
            }
            if (text.includes('bodyweight')) {
                data.availableEquipment = ['bodyweight'];
            }

            // Extract schedule
            if (text.includes('3 day') || text.includes('three day')) {
                data.workoutDays = ['monday', 'wednesday', 'friday'];
            }
            if (text.includes('5 day') || text.includes('five day')) {
                data.workoutDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
            }

            // Extract experience
            if (text.includes('beginner')) {
                data.experienceLevel = 'beginner';
            } else if (text.includes('advanced')) {
                data.experienceLevel = 'advanced';
            } else {
                data.experienceLevel = 'intermediate';
            }

            return data;
        }
    };

    const handleComplete = async () => {
        if (extractedData) {
            // Automatically create the goal when chat is complete
            try {
                const response = await fetch('/api/goals', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: extractedData.target || 'Fitness Goal',
                        description: extractedData.target || 'Personal fitness goal',
                        type: extractedData.goal_type || extractedData.type || 'general_fitness',
                        target: extractedData.target || 'Improve fitness',
                        timeframe: extractedData.timeframe || '3 months',
                        startDate: new Date().toISOString().split('T')[0],
                        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
                        isActive: true,
                        currentWeight: extractedData.current_weight || extractedData.currentWeight,
                        targetWeight: extractedData.target_weight || extractedData.targetWeight,
                        currentBench: extractedData.current_bench || extractedData.currentBench,
                        targetBench: extractedData.target_bench || extractedData.targetBench,
                        currentMileTime: extractedData.current_mile_time || extractedData.currentMileTime,
                        targetMileTime: extractedData.target_mile_time || extractedData.targetMileTime,
                        workoutDays: extractedData.workout_days || extractedData.workoutDays,
                        workoutDuration: extractedData.workout_duration || extractedData.workoutDuration,
                        workoutTime: extractedData.workout_time || extractedData.workoutTime,
                        experienceLevel: extractedData.experience_level || extractedData.experienceLevel,
                        availableEquipment: extractedData.available_equipment || extractedData.availableEquipment,
                        gymAccess: (extractedData.available_equipment || extractedData.availableEquipment)?.includes('gym_access') || false,
                        dietaryRestrictions: extractedData.dietary_restrictions || extractedData.dietaryRestrictions || [],
                        allergies: '',
                        mealPrepTime: 30,
                        cookingSkill: 'intermediate',
                        sleepSchedule: 'normal',
                        stressLevel: 'moderate',
                        travelFrequency: 'rarely',
                        previousInjuries: '',
                        medicalConditions: '',
                        motivationFactors: ['health', 'appearance', 'performance']
                    }),
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Goal created successfully:', result);

                    // Pass the created goal data to the parent
                    onComplete({
                        ...extractedData,
                        createdGoal: result.goal,
                        success: true
                    });
                } else {
                    throw new Error('Failed to create goal');
                }
            } catch (error) {
                console.error('Error creating goal:', error);

                // Pass error information to parent
                onComplete({
                    ...extractedData,
                    error: 'Failed to create goal. Please try again.',
                    success: false
                });
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-center">
                    🎯 Let's Create Your New Fitness Goal!
                </CardTitle>
                <p className="text-center text-gray-600">
                    Chat with me to set up your personalized fitness goal and plan
                </p>
            </CardHeader>
            <CardContent>
                {/* Chat Messages */}
                <div className="h-96 overflow-y-auto mb-4 border rounded-lg p-4 bg-gray-50">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.role === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-gray-800 border'
                                    }`}
                            >
                                <p className="text-sm">{message.content}</p>
                                <p className="text-xs opacity-70 mt-1">
                                    {message.timestamp.toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white text-gray-800 border px-4 py-2 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                    <span className="text-sm">Thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="flex space-x-2">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Tell me about your fitness goal..."
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button
                        onClick={handleSendMessage}
                        disabled={isLoading || !inputValue.trim()}
                    >
                        Send
                    </Button>
                </div>

                {/* Extracted Data Preview */}
                {extractedData && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">🎯 Perfect! I've Got Your Goal Info</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm text-green-800">
                            <div><strong>Goal:</strong> {extractedData.type}</div>
                            <div><strong>Target:</strong> {extractedData.target}</div>
                            <div><strong>Equipment:</strong> {extractedData.availableEquipment?.join(', ')}</div>
                            <div><strong>Experience:</strong> {extractedData.experienceLevel}</div>
                        </div>
                        <div className="mt-3 flex space-x-2">
                            <Button onClick={handleComplete} size="sm">
                                ✅ Create This Goal!
                            </Button>
                            <Button onClick={onCancel} variant="outline" size="sm">
                                🔄 Start Over
                            </Button>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between mt-4">
                    <Button onClick={onCancel} variant="outline">
                        Cancel
                    </Button>
                    {extractedData && (
                        <Button onClick={handleComplete}>
                            Create Goal
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
