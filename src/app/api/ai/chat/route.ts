import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const { messages, conversationStage } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: 'Messages array is required' },
                { status: 400 }
            );
        }

        // Create a system prompt based on the conversation stage
        let systemPrompt = '';

        switch (conversationStage) {
            case 'goal':
                systemPrompt = `You are a friendly, encouraging fitness coach helping someone create a new fitness goal. 
        
        Your role is to:
        1. Be warm and supportive
        2. Ask clarifying questions to understand their specific goal
        3. Help them articulate what they want to achieve
        4. Guide them toward measurable, specific goals
        
        Keep responses conversational and under 2-3 sentences. Ask one question at a time.
        
        Examples of good responses:
        - "That's a great goal! How much weight are you looking to lose, and what's your timeline?"
        - "Building muscle is awesome! What's your current strength level like?"
        - "Getting in shape means different things to different people. What does success look like for you specifically?"`;
                break;

            case 'details':
                systemPrompt = `You are a fitness coach gathering specific details about the user's goal. 
        
        Your role is to:
        1. Help them quantify their goal (specific numbers, measurements, timelines)
        2. Understand their current starting point
        3. Make their goal measurable and trackable
        
        Ask for specific details like:
        - Current weight vs target weight
        - Current strength levels vs target
        - Specific timeframes
        - Measurable milestones
        
        Keep responses encouraging and under 2-3 sentences.`;
                break;

            case 'preferences':
                systemPrompt = `You are a fitness coach understanding the user's setup and preferences. 
        
        Your role is to:
        1. Learn about their available equipment and facilities
        2. Understand their schedule and time constraints
        3. Assess their experience level
        4. Identify any dietary preferences or restrictions
        
        Ask about:
        - Equipment access (gym, home weights, bodyweight only)
        - Weekly schedule (how many days, preferred times)
        - Experience level (beginner, intermediate, advanced)
        - Dietary preferences or restrictions
        
        Keep responses conversational and under 2-3 sentences.`;
                break;

            default:
                systemPrompt = `You are a friendly fitness coach helping someone create a comprehensive fitness goal. 
        
        Be encouraging, ask clarifying questions, and help them articulate what they want to achieve. 
        Keep responses conversational and under 2-3 sentences.`;
        }

        // Format messages for OpenAI
        const openaiMessages = [
            { role: 'system', content: systemPrompt },
            ...messages.map((msg: any) => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            }))
        ] as any;

        // Use Hugging Face for AI responses
        let aiResponse = '';

        try {
            // Create a simple prompt for the AI
            const userMessage = messages[messages.length - 1]?.content || '';
            const prompt = `<s>[INST] You are a friendly fitness coach. ${systemPrompt}

User: ${userMessage}

Coach: [/INST]`;

            // Try Groq API first (more reliable free tier)
            try {
                console.log('=== GROQ API DEBUG INFO ===');
                console.log('Making request to Groq API...');

                const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.GROQ_API_KEY || 'gsk_...'}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: 'llama3-8b-8192',
                        messages: [
                            { role: 'system', content: `You are a friendly fitness coach. ${systemPrompt}` },
                            { role: 'user', content: messages[messages.length - 1]?.content || '' }
                        ],
                        max_tokens: 200,
                        temperature: 0.7,
                    })
                });

                console.log('Groq response status:', response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Groq error response:', errorText);
                    throw new Error(`Groq API error: ${response.status} - ${errorText}`);
                }

                const result = await response.json();
                console.log('Groq API response:', result);
                aiResponse = result.choices?.[0]?.message?.content || "I'm here to help you with your fitness goals!";
                console.log('Success with Groq API!');
                console.log('Generated response:', aiResponse);

            } catch (error: any) {
                console.error('Groq API failed:', error.message);
                // Fall back to intelligent simulated responses
                const userMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';

                if (conversationStage === 'goal') {
                    if (userMessage.includes('lose') || userMessage.includes('weight')) {
                        aiResponse = "That's a great goal! How much weight are you looking to lose, and what's your timeline?";
                    } else if (userMessage.includes('muscle') || userMessage.includes('strong')) {
                        aiResponse = "Building muscle is awesome! What's your current strength level like?";
                    } else if (userMessage.includes('fit') || userMessage.includes('shape')) {
                        aiResponse = "Getting in shape means different things to different people. What does success look like for you specifically?";
                    } else {
                        aiResponse = "That sounds like a great goal! Can you tell me more about what you want to achieve?";
                    }
                } else if (conversationStage === 'details') {
                    if (userMessage.includes('weight')) {
                        aiResponse = "Perfect! Now let's make this specific. What's your current weight and what's your target weight?";
                    } else if (userMessage.includes('bench') || userMessage.includes('strength')) {
                        aiResponse = "Great! What's your current bench press max, and what weight are you aiming for?";
                    } else {
                        aiResponse = "Excellent! Now let's get specific. Can you give me some numbers or measurements for your goal?";
                    }
                } else if (conversationStage === 'preferences') {
                    if (userMessage.includes('gym') || userMessage.includes('equipment')) {
                        aiResponse = "Perfect! What equipment do you have access to? Do you have a gym membership or just home equipment?";
                    } else if (userMessage.includes('time') || userMessage.includes('schedule')) {
                        aiResponse = "Great question! How many days per week can you work out, and what times work best for you?";
                    } else {
                        aiResponse = "Awesome! What's your experience level with fitness, and do you have any dietary preferences or restrictions?";
                    }
                } else {
                    aiResponse = "I'm here to help you create an amazing fitness goal! What would you like to achieve?";
                }
            }

            // Clean up the response if needed
            if (aiResponse.includes('Coach:')) {
                aiResponse = aiResponse.split('Coach:')[1]?.trim() || aiResponse;
            }

        } catch (error) {
            console.error('Error in AI chat:', error);
            return NextResponse.json(
                { error: 'Failed to process chat message' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            response: aiResponse,
            conversationStage
        });

    } catch (error) {
        console.error('Error in AI chat:', error);
        return NextResponse.json(
            { error: 'Failed to process chat message' },
            { status: 500 }
        );
    }
}
