import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { message, goalId, goalTitle, context } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        console.log('AI Chat request:', { message, goalId, goalTitle, context });

        // Create a context-aware prompt for Groq
        let systemPrompt = `You are FitSmith AI, a helpful fitness assistant. You help users modify their fitness plans, update goals, and answer fitness questions.`;

        if (context === 'plan_modification') {
            systemPrompt += `

You are helping with goal: "${goalTitle}"

You can:
1. Modify workout plans (make them harder/easier, change exercises, adjust sets/reps)
2. Update meal plans (change recipes, adjust calories/macros)
3. Modify goal details (timeframe, target, equipment)
4. Answer fitness questions
5. Provide motivation and tips

When suggesting plan modifications, be specific and actionable. If you're updating a workout, meal, or goal, provide the exact changes needed.

Always be encouraging and helpful!`;
        }

        // Call Groq API
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7,
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq API error:', errorText);
            throw new Error(`Groq API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        const aiResponse = result.choices?.[0]?.message?.content;

        if (!aiResponse) {
            throw new Error('No response from Groq');
        }

        // Check if the AI is suggesting plan updates
        let suggestedUpdates = null;
        if (aiResponse.toLowerCase().includes('update') ||
            aiResponse.toLowerCase().includes('change') ||
            aiResponse.toLowerCase().includes('modify')) {
            suggestedUpdates = {
                goalId,
                suggestions: aiResponse,
                timestamp: new Date().toISOString()
            };
        }

        return NextResponse.json({
            response: aiResponse,
            suggestedUpdates
        });

    } catch (error) {
        console.error('Error in AI chat:', error);
        return NextResponse.json(
            {
                error: 'Failed to get AI response',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
