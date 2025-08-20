import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { goalData } = await request.json();

    if (!goalData) {
      return NextResponse.json({ error: 'Goal data is required' }, { status: 400 });
    }

    console.log('Generating plan for goal:', goalData);

    // Prepare the prompt for Groq to generate comprehensive fitness plan
    const prompt = `Create a comprehensive fitness plan based on this goal data:

Goal: ${goalData.target}
Timeframe: ${goalData.timeframe}
Equipment: ${goalData.available_equipment.join(', ')}
Workout Days: ${goalData.workout_days.join(', ')}
Workout Duration: ${goalData.workout_duration} minutes

Please generate a complete plan with:
1. Weekly workout schedule with specific exercises, sets, reps, and weights
2. Weekly meal plan with calories, macros, and recipes
3. Stretching routines for each workout day
4. Progressive overload strategies
5. Progress tracking recommendations

Return ONLY valid JSON matching this structure:
{
  "workout_plan": {
    "weekly_schedule": [
      {
        "day": "monday",
        "workout_type": "strength",
        "exercises": [
          {
            "name": "Exercise Name",
            "sets": 4,
            "reps": "8-10",
            "weight": "Weight guidance",
            "notes": "Form notes"
          }
        ],
        "stretching": ["Stretch 1", "Stretch 2"]
      }
    ]
  },
  "meal_plan": {
    "daily_calories": 2000,
    "macros": {"protein": "150g", "carbs": "200g", "fat": "67g"},
    "weekly_meals": [
      {
        "day": "monday",
        "meals": [
          {
            "meal": "breakfast",
            "name": "Meal Name",
            "calories": 450,
            "ingredients": ["ingredient1", "ingredient2"],
            "instructions": "Cooking instructions"
          }
        ]
      }
    ]
  },
  "progress_tracking": {
    "weekly_checkpoints": ["Checkpoint 1", "Checkpoint 2"],
    "monthly_assessments": ["Assessment 1", "Assessment 2"]
  }
}`;

    // Call Groq API to generate the fitness plan
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
            content: `You are FitSmith Master Planner, an expert fitness coach and nutritionist. Your job is to create comprehensive, personalized fitness plans based on user input.

INPUT FORMAT: You will receive JSON data with:
- target: User's specific fitness goal
- timeframe: How long they want to take
- available_equipment: What equipment they have
- workout_days: Which days they can work out
- workout_duration: How long each workout should be

OUTPUT REQUIREMENTS:
1. Create a detailed weekly workout plan with specific exercises, sets, reps, and weights
2. Design a weekly meal plan with calories, macros, and recipes
3. Include stretching/mobility routines for each workout day
4. Provide progressive overload strategies
5. Include rest day recommendations

OUTPUT FORMAT: Return ONLY a valid JSON object with this structure:
{
  "workout_plan": {
    "weekly_schedule": [
      {
        "day": "monday",
        "workout_type": "strength",
        "exercises": [
          {
            "name": "Bench Press",
            "sets": 4,
            "reps": "8-10",
            "weight": "Start with 135 lbs, increase by 5-10 lbs weekly",
            "notes": "Focus on form, control the descent"
          }
        ],
        "stretching": ["Chest stretches", "Shoulder mobility", "Tricep stretches"]
      }
    ]
  },
  "meal_plan": {
    "daily_calories": 2000,
    "macros": {"protein": "150g", "carbs": "200g", "fat": "67g"},
    "weekly_meals": [
      {
        "day": "monday",
        "meals": [
          {
            "meal": "breakfast",
            "name": "Protein Oatmeal Bowl",
            "calories": 450,
            "ingredients": ["oats", "protein powder", "banana", "almonds"],
            "instructions": "Cook oats, mix in protein powder, top with banana and almonds"
          }
        ]
      }
    ]
  },
  "progress_tracking": {
    "weekly_checkpoints": ["Weight", "Strength gains", "Energy levels"],
    "monthly_assessments": ["Body measurements", "Progress photos", "Performance tests"]
  }
}

IMPORTANT:
- Be specific with exercise details
- Include progressive overload strategies
- Make meals realistic and tasty
- Consider the user's equipment limitations
- Focus on the user's specific goal
- Always return valid JSON
- CRITICAL: All exercise "sets" must be NUMBERS ONLY (e.g., 3, 4, 5) - NEVER use ranges like "20-30 minutes"
- CRITICAL: All exercise "reps" must be STRINGS ONLY (e.g., "8-10", "10-12", "15") - NEVER use "N/A"
- CRITICAL: All exercise "weight" must be STRINGS ONLY (e.g., "135 lbs", "20-25 lbs") - NEVER use "N/A"
- CRITICAL: For cardio exercises, use "sets": 1 and put duration in "notes" field
- CRITICAL: All values must be valid JSON data types - NO "N/A", NO ranges, NO invalid characters
- CRITICAL: If you cannot provide a valid value, use a reasonable default instead of "N/A"`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    const generatedPlan = result.choices?.[0]?.message?.content;

    if (!generatedPlan) {
      throw new Error('No plan generated from Groq');
    }

    console.log('Plan generated successfully');

    // Function to fix common JSON issues
    const fixCommonJsonIssues = (jsonString: string): string => {
      let fixed = jsonString;

      // Fix "sets": 20-30 minutes → "sets": 1
      fixed = fixed.replace(/"sets":\s*(\d+-\d+)\s*minutes/g, '"sets": 1');
      fixed = fixed.replace(/"sets":\s*(\d+-\d+)\s*min/g, '"sets": 1');

      // Fix "reps": N/A → "reps": "N/A"
      fixed = fixed.replace(/"reps":\s*N\/A/g, '"reps": "N/A"');
      fixed = fixed.replace(/"reps":\s*N\/A/g, '"reps": "N/A"');

      // Fix "weight": N/A → "weight": "Bodyweight"
      fixed = fixed.replace(/"weight":\s*N\/A/g, '"weight": "Bodyweight"');
      fixed = fixed.replace(/"weight":\s*N\/A/g, '"weight": "Bodyweight"');

      // Fix any other N/A values
      fixed = fixed.replace(/"([^"]+)":\s*N\/A/g, '"$1": "N/A"');

      console.log('Fixed JSON issues:', fixed.substring(0, 200) + '...');
      return fixed;
    };

    // Try to parse the JSON response to validate it
    let parsedPlan;
    try {
      // Groq sometimes adds explanatory text before/after JSON, so extract just the JSON part
      // Look for the first complete JSON object (from { to the last })
      const jsonStart = generatedPlan.indexOf('{');
      const jsonEnd = generatedPlan.lastIndexOf('}');

      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const jsonString = generatedPlan.substring(jsonStart, jsonEnd + 1);
        console.log('Extracted JSON string:', jsonString.substring(0, 200) + '...');

        // Try to parse the extracted JSON
        try {
          parsedPlan = JSON.parse(jsonString);
          console.log('✅ Successfully parsed extracted JSON');
        } catch (extractError) {
          console.log('❌ Failed to parse extracted JSON, trying to find complete JSON...');

          // Try to find a more complete JSON by looking for balanced braces
          let braceCount = 0;
          let completeJsonEnd = -1;

          for (let i = jsonStart; i < generatedPlan.length; i++) {
            if (generatedPlan[i] === '{') braceCount++;
            if (generatedPlan[i] === '}') {
              braceCount--;
              if (braceCount === 0) {
                completeJsonEnd = i;
                break;
              }
            }
          }

          if (completeJsonEnd !== -1) {
            const completeJsonString = generatedPlan.substring(jsonStart, completeJsonEnd + 1);
            console.log('Found complete JSON with balanced braces:', completeJsonString.substring(0, 200) + '...');

            // Try to clean up any trailing text that might cause JSON parsing issues
            const cleanedJsonString = completeJsonString.trim();

            try {
              parsedPlan = JSON.parse(cleanedJsonString);
              console.log('✅ Successfully parsed complete JSON');
            } catch (cleanError) {
              console.log('❌ Still failed after cleaning, trying to fix common JSON issues...');

              // Try to fix common JSON issues automatically
              const fixedJsonString = fixCommonJsonIssues(cleanedJsonString);
              console.log('Trying fixed JSON string:', fixedJsonString.substring(0, 200) + '...');

              try {
                parsedPlan = JSON.parse(fixedJsonString);
                console.log('✅ Successfully parsed fixed JSON');
              } catch (fixError) {
                console.log('❌ Still failed after fixing, trying final extraction...');

                // Try to find the actual JSON by looking for the last complete object
                const lastBraceIndex = cleanedJsonString.lastIndexOf('}');
                if (lastBraceIndex !== -1) {
                  const finalJsonString = cleanedJsonString.substring(0, lastBraceIndex + 1);
                  console.log('Trying final JSON string:', finalJsonString.substring(0, 200) + '...');
                  parsedPlan = JSON.parse(finalJsonString);
                  console.log('✅ Successfully parsed final JSON');
                } else {
                  throw new Error('Could not extract valid JSON');
                }
              }
            }
          } else {
            throw new Error('Could not find complete JSON with balanced braces');
          }
        }
      } else {
        // Fallback: try to parse the entire response
        console.log('Falling back to parsing entire response');
        parsedPlan = JSON.parse(generatedPlan);
      }
    } catch (parseError) {
      console.error('Error parsing Groq response:', parseError);
      console.error('Raw response:', generatedPlan);
      throw new Error('Invalid JSON response from Groq');
    }

    return NextResponse.json({
      success: true,
      plan: parsedPlan,
      rawResponse: generatedPlan
    });

  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate fitness plan',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
