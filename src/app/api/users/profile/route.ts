import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/users/profile - Get user profile
export async function GET(request: NextRequest) {
  try {
    // Get user ID from query params or headers (we'll enhance this with auth later)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        error: 'User ID is required',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    // Get user profile from database
    const { data: profile, error } = await supabaseAdmin
      .from('user_profile')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Profile doesn't exist yet
        return NextResponse.json({
          message: 'Profile not found',
          profile: null,
          timestamp: new Date().toISOString()
        });
      }
      
      return NextResponse.json({
        error: 'Failed to fetch profile',
        details: error.message,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Profile retrieved successfully',
      profile,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// POST /api/users/profile - Create or update user profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, sex, dob, height_cm, weight_kg, activity_level, dietary_prefs, equipment, timezone } = body;

    if (!user_id) {
      return NextResponse.json({
        error: 'User ID is required',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    // Check if profile already exists
    const { data: existingProfile } = await supabaseAdmin
      .from('user_profile')
      .select('id')
      .eq('user_id', user_id)
      .single();

    let result;
    
    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabaseAdmin
        .from('user_profile')
        .update({
          sex,
          dob,
          height_cm,
          weight_kg,
          activity_level,
          dietary_prefs: dietary_prefs || {},
          equipment: equipment || [],
          timezone: timezone || 'America/New_York',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user_id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({
          error: 'Failed to update profile',
          details: error.message,
          timestamp: new Date().toISOString()
        }, { status: 500 });
      }

      result = data;
    } else {
      // Create new profile
      const { data, error } = await supabaseAdmin
        .from('user_profile')
        .insert({
          user_id,
          sex,
          dob,
          height_cm,
          weight_kg,
          activity_level,
          dietary_prefs: dietary_prefs || {},
          equipment: equipment || [],
          timezone: timezone || 'America/New_York'
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({
          error: 'Failed to create profile',
          details: error.message,
          timestamp: new Date().toISOString()
        }, { status: 500 });
      }

      result = data;
    }

    return NextResponse.json({
      message: existingProfile ? 'Profile updated successfully' : 'Profile created successfully',
      profile: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
