import mongoose, { Schema, Document, Model } from 'mongoose';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface ITask extends Document {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  userId: mongoose.Types.ObjectId;
  tags: string[];
  aiSuggested?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title must be at least 1 character'],
      maxlength: [200, 'Title must not exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description must not exceed 1000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM,
    },
    dueDate: {
      type: Date,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags: string[]) => tags.length <= 10,
        message: 'Maximum 10 tags allowed',
      },
    },
    aiSuggested: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
TaskSchema.index({ userId: 1, status: 1 });
TaskSchema.index({ userId: 1, createdAt: -1 });

// Prevent re-compilation during development
const Task: Model<ITask> = 
  (mongoose.models && mongoose.models.Task) 
    ? mongoose.models.Task as Model<ITask>
    : mongoose.model<ITask>('Task', TaskSchema);

export default Task;

