/* ============================================
   Agent 面试直通车 - 类型定义
   ============================================ */

// LeetCode 题目
export interface LeetCodeProblem {
  id: number;
  title: string;
  title_cn: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  tags: string;
  description: string;
  leetcode_url: string;
  solution_hint: string;
  heat_rating: number;  // 1-5 热度星级 (5=必刷, 1=选做)
  is_favorited: number; // 0 or 1
  is_solved: number;    // 0 or 1
  created_at: string;
}

// Java 面试题
export interface JavaQuestion {
  id: number;
  category: string;
  question: string;
  answer: string;
  tags: string;
  importance: number; // 1-5
  is_favorited: number;
  created_at: string;
}

// AI Agent 面试题
export interface AIQuestion {
  id: number;
  category: string;
  question: string;
  answer: string;
  tags: string;
  importance: number;
  is_favorited: number;
  created_at: string;
}

// 知识条目
export interface KnowledgeEntry {
  id: number;
  title: string;
  content: string;
  source_type: 'ai_search' | 'personal';
  source_url: string;
  source_name: string;
  category: string;
  tags: string;
  is_favorited: number;
  created_at: string;
  updated_at: string;
}

// 搜索请求
export interface SearchParams {
  query?: string;
  category?: string;
  difficulty?: string;
  source_type?: string;
  page?: number;
  pageSize?: number;
  is_favorited?: number;
}

// 分页结果
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
