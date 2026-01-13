import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import Task, { TaskStatus, TaskPriority } from '@/models/Task';
import { taskSchema } from '@/lib/validations';

// GET - Fetch all tasks for the authenticated user
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
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    
    const query: any = { userId: session.user.id };
    
    if (status && Object.values(TaskStatus).includes(status as TaskStatus)) {
      query.status = status;
    }
    
    if (priority && Object.values(TaskPriority).includes(priority as TaskPriority)) {
      query.priority = priority;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new task
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate input
    const validatedData = taskSchema.parse(body);
    
    await connectDB();
    
    const task = await Task.create({
      ...validatedData,
      userId: session.user.id,
      dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
    });
    
    return NextResponse.json(
      { task, message: 'Task created successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }
    
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

