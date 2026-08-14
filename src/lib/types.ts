// frontend/src/types/index.ts

// Threads
export interface ThreadResponse {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
  replyCount?: number;
}
export interface CreateThreadDTO {
  title: string;
  content: string;
  authorId: string;
}

// Filtros para queries
export interface ThreadFilters {
  authorId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

// Replies
export interface ReplyResponse {
  id: string;
  content: string;
  threadId: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReplyDTO {
  content: string;
  threadId: string;
  authorId: string;
}