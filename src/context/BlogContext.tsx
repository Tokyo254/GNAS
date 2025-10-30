// contexts/BlogContext.tsx
import React, { createContext, useContext, useReducer, type ReactNode } from 'react';

interface BlogState {
  likedPosts: number[];
  bookmarkedPosts: number[];
  reportedPosts: number[];
  likedComments: number[];
}

type BlogAction = 
  | { type: 'TOGGLE_LIKE'; postId: number }
  | { type: 'TOGGLE_BOOKMARK'; postId: number }
  | { type: 'REPORT_POST'; postId: number }
  | { type: 'TOGGLE_COMMENT_LIKE'; commentId: number };

const BlogContext = createContext<{
  state: BlogState;
  dispatch: React.Dispatch<BlogAction>;
} | undefined>(undefined);

const blogReducer = (state: BlogState, action: BlogAction): BlogState => {
  switch (action.type) {
    case 'TOGGLE_LIKE':
      return {
        ...state,
        likedPosts: state.likedPosts.includes(action.postId)
          ? state.likedPosts.filter(id => id !== action.postId)
          : [...state.likedPosts, action.postId]
      };
    case 'TOGGLE_BOOKMARK':
      return {
        ...state,
        bookmarkedPosts: state.bookmarkedPosts.includes(action.postId)
          ? state.bookmarkedPosts.filter(id => id !== action.postId)
          : [...state.bookmarkedPosts, action.postId]
      };
    case 'REPORT_POST':
      return {
        ...state,
        reportedPosts: [...state.reportedPosts, action.postId]
      };
    case 'TOGGLE_COMMENT_LIKE':
      return {
        ...state,
        likedComments: state.likedComments.includes(action.commentId)
          ? state.likedComments.filter(id => id !== action.commentId)
          : [...state.likedComments, action.commentId]
      };
    default:
      return state;
  }
};

export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(blogReducer, {
    likedPosts: [],
    bookmarkedPosts: [],
    reportedPosts: [],
    likedComments: []
  });

  return (
    <BlogContext.Provider value={{ state, dispatch }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};