import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import { generateTaskSuggestions } from '@/lib/ai-helper';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    // Fetch user's existing tasks for context
    const existingTasks = await Task.find({ userId: session.user.id })
      .select('title description tags')
      .limit(20)
      .lean();
    
    const suggestions = await generateTaskSuggestions(existingTasks);
    
    return NextResponse.json({ suggestions }, { status: 200 });
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

