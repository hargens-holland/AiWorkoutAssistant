import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const { messages } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: 'Messages array is required' },
                { status: 400 }
            );
        }

        // Create a system prompt for data extraction
        const systemPrompt = `You are a fitness data extraction specialist. Your job is to analyze a conversation about fitness goals and extract structured data.

    Extract the following information from the conversation:
    - goal_type: "weight_loss", "muscle_gain", "endurance", "strength", "general_fitness", or "flexibility"
    - target: A specific, measurable target (e.g., "Lose 20 pounds", "Bench 225 pounds", "Run a 5k")
    - timeframe: Estimated timeframe (e.g., "3 months", "6 months", "1 year")
    - current_weight: Current weight if mentioned (number only)
    - target_weight: Target weight if mentioned (number only)
    - current_bench: Current bench press if mentioned (number only)
    - target_bench: Target bench press if mentioned (number only)
    - current_mile_time: Current mile time if mentioned (format: "MM:SS")
    - target_mile_time: Target mile time if mentioned (format: "MM:SS")
    - workout_days: Array of workout days (e.g., ["monday", "wednesday", "friday"])
    - workout_duration: Workout duration in minutes (number only)
    - workout_time: Preferred workout time ("morning", "afternoon", "evening", or "flexible")
    - experience_level: "beginner", "intermediate", or "advanced"
    - available_equipment: Array of available equipment (e.g., ["dumbbells", "gym_access", "bodyweight"])
    - dietary_restrictions: Array of dietary restrictions (e.g., ["vegetarian", "gluten_free", "none"])

    Return ONLY a valid JSON object with these fields. If a field is not mentioned or unclear, use null or an appropriate default value.
    
    Example response format:
    {
      "goal_type": "weight_loss",
      "target": "Lose 20 pounds",
      "timeframe": "3 months",
      "current_weight": 180,
      "target_weight": 160,
      "current_bench": null,
      "target_bench": null,
      "current_mile_time": null,
      "target_mile_time": null,
      "workout_days": ["monday", "wednesday", "friday"],
      "workout_duration": 45,
      "workout_time": "evening",
      "experience_level": "beginner",
      "available_equipment": ["dumbbells"],
      "dietary_restrictions": ["none"]
    }`;

        // Format messages for OpenAI
        const openaiMessages = [
            { role: 'system', content: systemPrompt },
            ...messages.map((msg: any) => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            }))
        ] as any;

        // Use Hugging Face for data extraction
        let aiResponse = '';

        try {
            // Create a structured prompt for extraction
            const conversationText = messages.map(m => `${m.role}: ${m.content}`).join('\n');
            const extractionPrompt = `<s>[INST] ${systemPrompt}

Conversation:
${conversationText}

Extract the fitness goal data as JSON: [/INST]`;

            // Use Hugging Face's own inference API directly
            try {
                console.log('=== HF EXTRACTION API DEBUG INFO ===');
                console.log('API URL:', `https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta`);
                console.log('API Key (first 10 chars):', process.env.HUGGINGFACE_API_KEY?.substring(0, 10) + '...');
                console.log('Prompt length:', extractionPrompt.length);
                console.log('Making extraction request to HF inference API...');

                // Make direct HTTP request to HF inference API with correct format
                const response = await fetch(`https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        inputs: extractionPrompt,
                        parameters: {
                            max_new_tokens: 300,
                            temperature: 0.1,
                            return_full_text: false
                        }
                    })
                });

                console.log('Extraction response status:', response.status);
                console.log('Extraction response headers:', Object.fromEntries(response.headers.entries()));

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Full extraction error response:', errorText);
                    throw new Error(`HF API error: ${response.status} - ${errorText}`);
                }

                const result = await response.json();
                console.log('Extraction API response:', result);
                aiResponse = result[0]?.generated_text || '{}';
                console.log('Extraction success with HF inference API!');
                console.log('Extracted response:', aiResponse);

            } catch (error: any) {
                console.error('GPT-2 extraction failed:', error.message);
                // Fallback to simulated data
                aiResponse = JSON.stringify({
                    goal_type: 'weight_loss',
                    target: 'Lose weight and get stronger',
                    timeframe: '3 months',
                    current_weight: 180,
                    target_weight: 160,
                    current_bench: null,
                    target_bench: 225,
                    current_mile_time: null,
                    target_mile_time: null,
                    workout_days: ['monday', 'wednesday', 'friday'],
                    workout_duration: 45,
                    workout_time: 'evening',
                    experience_level: 'beginner',
                    available_equipment: ['dumbbells', 'bodyweight'],
                    dietary_restrictions: ['none']
                });
            }

        } catch (error) {
            console.error('Hugging Face extraction error:', error);
            // Fallback to simulated data
            aiResponse = JSON.stringify({
                goal_type: 'weight_loss',
                target: 'Lose weight and get stronger',
                timeframe: '3 months',
                current_weight: 180,
                target_weight: 160,
                current_bench: null,
                target_bench: 225,
                current_mile_time: null,
                target_mile_time: null,
                workout_days: ['monday', 'wednesday', 'friday'],
                workout_duration: 45,
                workout_time: 'evening',
                experience_level: 'beginner',
                available_equipment: ['dumbbells', 'bodyweight'],
                dietary_restrictions: ['none']
            });
        }

        // Try to parse the JSON response
        let extractedData;
        try {
            extractedData = JSON.parse(aiResponse);
        } catch (parseError) {
            console.error('Error parsing AI response:', parseError);
            // Fallback to basic extraction
            extractedData = {
                goal_type: 'general_fitness',
                target: 'Improve fitness',
                timeframe: '3 months',
                workout_days: ['monday', 'wednesday', 'friday'],
                workout_duration: 45,
                workout_time: 'evening',
                experience_level: 'beginner',
                available_equipment: ['bodyweight'],
                dietary_restrictions: ['none']
            };
        }

        // Ensure all required fields exist with defaults
        const finalData = {
            goal_type: extractedData.goal_type || 'general_fitness',
            target: extractedData.target || 'Improve fitness',
            timeframe: extractedData.timeframe || '3 months',
            current_weight: extractedData.current_weight || null,
            target_weight: extractedData.target_weight || null,
            current_bench: extractedData.current_bench || null,
            target_bench: extractedData.target_bench || null,
            current_mile_time: extractedData.current_mile_time || null,
            target_mile_time: extractedData.target_mile_time || null,
            workout_days: extractedData.workout_days || ['monday', 'wednesday', 'friday'],
            workout_duration: extractedData.workout_duration || 45,
            workout_time: extractedData.workout_time || 'evening',
            experience_level: extractedData.experience_level || 'beginner',
            available_equipment: extractedData.available_equipment || ['bodyweight'],
            dietary_restrictions: extractedData.dietary_restrictions || ['none']
        };

        return NextResponse.json({
            extractedData: finalData,
            rawResponse: aiResponse
        });

    } catch (error) {
        console.error('Error in goal extraction:', error);
        return NextResponse.json(
            { error: 'Failed to extract goal data' },
            { status: 500 }
        );
    }
}
