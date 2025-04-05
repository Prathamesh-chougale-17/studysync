export interface Task {
    _id?: string;
    title: string;
    isDone: boolean;
    createdAt: Date;
    userId: string;
  }
  
  export interface Note {
    _id?: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: Date;
    userId: string;
  }
  
  export interface User {
    _id?: string;
    username: string;
    email: string;
    streak: number;
    lastActive: Date;
  }
  