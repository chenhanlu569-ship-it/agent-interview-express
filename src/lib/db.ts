/**
 * SQLite 数据库层
 * 使用 better-sqlite3 实现本地结构化数据存储
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// 数据库文件路径
const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'interview.db');

// 确保数据目录存在
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// 创建数据库连接（单例模式）
let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    _db.pragma('foreign_keys = ON');
    initTables(_db);
  }
  return _db;
}

/** 初始化数据表 */
function initTables(db: Database.Database) {
  db.exec(`
    -- LeetCode 热题表
    CREATE TABLE IF NOT EXISTS leetcode_problems (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      title_cn TEXT NOT NULL DEFAULT '',
      difficulty TEXT NOT NULL CHECK(difficulty IN ('Easy', 'Medium', 'Hard')),
      category TEXT NOT NULL DEFAULT '',
      tags TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      leetcode_url TEXT NOT NULL DEFAULT '',
      solution_hint TEXT NOT NULL DEFAULT '',
      is_favorited INTEGER NOT NULL DEFAULT 0,
      is_solved INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Java 面试题表
    CREATE TABLE IF NOT EXISTS java_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL DEFAULT '',
      question TEXT NOT NULL,
      answer TEXT NOT NULL DEFAULT '',
      tags TEXT NOT NULL DEFAULT '',
      importance INTEGER NOT NULL DEFAULT 3 CHECK(importance BETWEEN 1 AND 5),
      is_favorited INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- AI Agent 面试题表
    CREATE TABLE IF NOT EXISTS ai_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL DEFAULT '',
      question TEXT NOT NULL,
      answer TEXT NOT NULL DEFAULT '',
      tags TEXT NOT NULL DEFAULT '',
      importance INTEGER NOT NULL DEFAULT 3 CHECK(importance BETWEEN 1 AND 5),
      is_favorited INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- 知识条目表（AI搜索 + 个人上传）
    CREATE TABLE IF NOT EXISTS knowledge_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      source_type TEXT NOT NULL CHECK(source_type IN ('ai_search', 'personal')),
      source_url TEXT NOT NULL DEFAULT '',
      source_name TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      tags TEXT NOT NULL DEFAULT '',
      is_favorited INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- 索引
    CREATE INDEX IF NOT EXISTS idx_leetcode_category ON leetcode_problems(category);
    CREATE INDEX IF NOT EXISTS idx_leetcode_difficulty ON leetcode_problems(difficulty);
    CREATE INDEX IF NOT EXISTS idx_java_category ON java_questions(category);
    CREATE INDEX IF NOT EXISTS idx_ai_category ON ai_questions(category);
    CREATE INDEX IF NOT EXISTS idx_knowledge_source ON knowledge_entries(source_type);
    CREATE INDEX IF NOT EXISTS idx_knowledge_category ON knowledge_entries(category);
  `);
}

/* ============================================
   通用 CRUD 操作
   ============================================ */

/** 通用分页查询 */
function paginatedQuery<T>(
  table: string,
  where: string,
  params: Record<string, unknown>,
  page: number,
  pageSize: number,
  orderBy = 'id ASC'
): { data: T[]; total: number } {
  const db = getDb();
  const offset = (page - 1) * pageSize;

  const countRow = db.prepare(
    `SELECT COUNT(*) as total FROM ${table} ${where}`
  ).get(params) as { total: number };

  const data = db.prepare(
    `SELECT * FROM ${table} ${where} ORDER BY ${orderBy} LIMIT @limit OFFSET @offset`
  ).all({ ...params, limit: pageSize, offset }) as T[];

  return { data, total: countRow.total };
}

/* ============================================
   LeetCode 操作
   ============================================ */
export const leetcodeRepo = {
  list(params: {
    category?: string;
    difficulty?: string;
    search?: string;
    is_favorited?: number;
    is_solved?: number;
    page?: number;
    pageSize?: number;
  }) {
    const conditions: string[] = [];
    const values: Record<string, unknown> = {};

    if (params.category && params.category !== 'all') {
      conditions.push('category = @category');
      values.category = params.category;
    }
    if (params.difficulty && params.difficulty !== 'all') {
      conditions.push('difficulty = @difficulty');
      values.difficulty = params.difficulty;
    }
    if (params.search) {
      conditions.push('(title LIKE @search OR title_cn LIKE @search OR tags LIKE @search)');
      values.search = `%${params.search}%`;
    }
    if (params.is_favorited !== undefined) {
      conditions.push('is_favorited = @is_favorited');
      values.is_favorited = params.is_favorited;
    }
    if (params.is_solved !== undefined) {
      conditions.push('is_solved = @is_solved');
      values.is_solved = params.is_solved;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;

    return paginatedQuery<import('./types').LeetCodeProblem>(
      'leetcode_problems', where, values, page, pageSize, 'id ASC'
    );
  },

  getById(id: number) {
    return getDb().prepare('SELECT * FROM leetcode_problems WHERE id = ?').get(id) as import('./types').LeetCodeProblem | undefined;
  },

  toggleFavorite(id: number) {
    getDb().prepare('UPDATE leetcode_problems SET is_favorited = 1 - is_favorited WHERE id = ?').run(id);
  },

  toggleSolved(id: number) {
    getDb().prepare('UPDATE leetcode_problems SET is_solved = 1 - is_solved WHERE id = ?').run(id);
  },

  getCategories() {
    return getDb().prepare(
      'SELECT DISTINCT category, COUNT(*) as count FROM leetcode_problems GROUP BY category ORDER BY category'
    ).all() as { category: string; count: number }[];
  },

  getStats() {
    const db = getDb();
    const total = (db.prepare('SELECT COUNT(*) as c FROM leetcode_problems').get() as { c: number }).c;
    const solved = (db.prepare('SELECT COUNT(*) as c FROM leetcode_problems WHERE is_solved = 1').get() as { c: number }).c;
    const favorited = (db.prepare('SELECT COUNT(*) as c FROM leetcode_problems WHERE is_favorited = 1').get() as { c: number }).c;
    const easy = (db.prepare("SELECT COUNT(*) as c FROM leetcode_problems WHERE difficulty = 'Easy'").get() as { c: number }).c;
    const medium = (db.prepare("SELECT COUNT(*) as c FROM leetcode_problems WHERE difficulty = 'Medium'").get() as { c: number }).c;
    const hard = (db.prepare("SELECT COUNT(*) as c FROM leetcode_problems WHERE difficulty = 'Hard'").get() as { c: number }).c;
    return { total, solved, favorited, easy, medium, hard };
  },

  insert(data: Omit<import('./types').LeetCodeProblem, 'id' | 'created_at' | 'is_favorited' | 'is_solved'>) {
    const db = getDb();
    db.prepare(`
      INSERT INTO leetcode_problems (id, title, title_cn, difficulty, category, tags, description, leetcode_url, solution_hint)
      VALUES (@id, @title, @title_cn, @difficulty, @category, @tags, @description, @leetcode_url, @solution_hint)
    `).run(data);
  },
};

/* ============================================
   Java 面试题操作
   ============================================ */
export const javaRepo = {
  list(params: {
    category?: string;
    search?: string;
    is_favorited?: number;
    page?: number;
    pageSize?: number;
  }) {
    const conditions: string[] = [];
    const values: Record<string, unknown> = {};

    if (params.category && params.category !== 'all') {
      conditions.push('category = @category');
      values.category = params.category;
    }
    if (params.search) {
      conditions.push('(question LIKE @search OR answer LIKE @search OR tags LIKE @search)');
      values.search = `%${params.search}%`;
    }
    if (params.is_favorited !== undefined) {
      conditions.push('is_favorited = @is_favorited');
      values.is_favorited = params.is_favorited;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;

    return paginatedQuery<import('./types').JavaQuestion>(
      'java_questions', where, values, page, pageSize, 'importance DESC, id ASC'
    );
  },

  getById(id: number) {
    return getDb().prepare('SELECT * FROM java_questions WHERE id = ?').get(id) as import('./types').JavaQuestion | undefined;
  },

  create(data: { category: string; question: string; answer: string; tags?: string; importance?: number }) {
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO java_questions (category, question, answer, tags, importance)
      VALUES (@category, @question, @answer, @tags, @importance)
    `).run({
      category: data.category,
      question: data.question,
      answer: data.answer,
      tags: data.tags || '',
      importance: data.importance || 3,
    });
    return result.lastInsertRowid;
  },

  update(id: number, data: Partial<{ category: string; question: string; answer: string; tags: string; importance: number }>) {
    const fields: string[] = [];
    const values: Record<string, unknown> = { id };

    if (data.category !== undefined) { fields.push('category = @category'); values.category = data.category; }
    if (data.question !== undefined) { fields.push('question = @question'); values.question = data.question; }
    if (data.answer !== undefined) { fields.push('answer = @answer'); values.answer = data.answer; }
    if (data.tags !== undefined) { fields.push('tags = @tags'); values.tags = data.tags; }
    if (data.importance !== undefined) { fields.push('importance = @importance'); values.importance = data.importance; }

    if (fields.length > 0) {
      getDb().prepare(`UPDATE java_questions SET ${fields.join(', ')} WHERE id = @id`).run(values);
    }
  },

  delete(id: number) {
    getDb().prepare('DELETE FROM java_questions WHERE id = ?').run(id);
  },

  toggleFavorite(id: number) {
    getDb().prepare('UPDATE java_questions SET is_favorited = 1 - is_favorited WHERE id = ?').run(id);
  },

  getCategories() {
    return getDb().prepare(
      'SELECT DISTINCT category, COUNT(*) as count FROM java_questions GROUP BY category ORDER BY count DESC'
    ).all() as { category: string; count: number }[];
  },
};

/* ============================================
   AI Agent 面试题操作
   ============================================ */
export const aiRepo = {
  list(params: {
    category?: string;
    search?: string;
    is_favorited?: number;
    page?: number;
    pageSize?: number;
  }) {
    const conditions: string[] = [];
    const values: Record<string, unknown> = {};

    if (params.category && params.category !== 'all') {
      conditions.push('category = @category');
      values.category = params.category;
    }
    if (params.search) {
      conditions.push('(question LIKE @search OR answer LIKE @search OR tags LIKE @search)');
      values.search = `%${params.search}%`;
    }
    if (params.is_favorited !== undefined) {
      conditions.push('is_favorited = @is_favorited');
      values.is_favorited = params.is_favorited;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;

    return paginatedQuery<import('./types').AIQuestion>(
      'ai_questions', where, values, page, pageSize, 'importance DESC, id ASC'
    );
  },

  getById(id: number) {
    return getDb().prepare('SELECT * FROM ai_questions WHERE id = ?').get(id) as import('./types').AIQuestion | undefined;
  },

  create(data: { category: string; question: string; answer: string; tags?: string; importance?: number }) {
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO ai_questions (category, question, answer, tags, importance)
      VALUES (@category, @question, @answer, @tags, @importance)
    `).run({
      category: data.category,
      question: data.question,
      answer: data.answer,
      tags: data.tags || '',
      importance: data.importance || 3,
    });
    return result.lastInsertRowid;
  },

  update(id: number, data: Partial<{ category: string; question: string; answer: string; tags: string; importance: number }>) {
    const fields: string[] = [];
    const values: Record<string, unknown> = { id };

    if (data.category !== undefined) { fields.push('category = @category'); values.category = data.category; }
    if (data.question !== undefined) { fields.push('question = @question'); values.question = data.question; }
    if (data.answer !== undefined) { fields.push('answer = @answer'); values.answer = data.answer; }
    if (data.tags !== undefined) { fields.push('tags = @tags'); values.tags = data.tags; }
    if (data.importance !== undefined) { fields.push('importance = @importance'); values.importance = data.importance; }

    if (fields.length > 0) {
      getDb().prepare(`UPDATE ai_questions SET ${fields.join(', ')} WHERE id = @id`).run(values);
    }
  },

  delete(id: number) {
    getDb().prepare('DELETE FROM ai_questions WHERE id = ?').run(id);
  },

  toggleFavorite(id: number) {
    getDb().prepare('UPDATE ai_questions SET is_favorited = 1 - is_favorited WHERE id = ?').run(id);
  },

  getCategories() {
    return getDb().prepare(
      'SELECT DISTINCT category, COUNT(*) as count FROM ai_questions GROUP BY category ORDER BY count DESC'
    ).all() as { category: string; count: number }[];
  },
};

/* ============================================
   知识条目操作
   ============================================ */
export const knowledgeRepo = {
  list(params: {
    source_type?: string;
    category?: string;
    search?: string;
    is_favorited?: number;
    page?: number;
    pageSize?: number;
  }) {
    const conditions: string[] = [];
    const values: Record<string, unknown> = {};

    if (params.source_type && params.source_type !== 'all') {
      conditions.push('source_type = @source_type');
      values.source_type = params.source_type;
    }
    if (params.category && params.category !== 'all') {
      conditions.push('category = @category');
      values.category = params.category;
    }
    if (params.search) {
      conditions.push('(title LIKE @search OR content LIKE @search OR tags LIKE @search)');
      values.search = `%${params.search}%`;
    }
    if (params.is_favorited !== undefined) {
      conditions.push('is_favorited = @is_favorited');
      values.is_favorited = params.is_favorited;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;

    return paginatedQuery<import('./types').KnowledgeEntry>(
      'knowledge_entries', where, values, page, pageSize, 'updated_at DESC'
    );
  },

  getById(id: number) {
    return getDb().prepare('SELECT * FROM knowledge_entries WHERE id = ?').get(id) as import('./types').KnowledgeEntry | undefined;
  },

  create(data: {
    title: string;
    content: string;
    source_type: 'ai_search' | 'personal';
    source_url?: string;
    source_name?: string;
    category?: string;
    tags?: string;
  }) {
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO knowledge_entries (title, content, source_type, source_url, source_name, category, tags)
      VALUES (@title, @content, @source_type, @source_url, @source_name, @category, @tags)
    `).run({
      title: data.title,
      content: data.content,
      source_type: data.source_type,
      source_url: data.source_url || '',
      source_name: data.source_name || '',
      category: data.category || '',
      tags: data.tags || '',
    });
    return result.lastInsertRowid;
  },

  update(id: number, data: Partial<{
    title: string;
    content: string;
    source_url: string;
    source_name: string;
    category: string;
    tags: string;
  }>) {
    const fields: string[] = ["updated_at = datetime('now')"];
    const values: Record<string, unknown> = { id };

    if (data.title !== undefined) { fields.push('title = @title'); values.title = data.title; }
    if (data.content !== undefined) { fields.push('content = @content'); values.content = data.content; }
    if (data.source_url !== undefined) { fields.push('source_url = @source_url'); values.source_url = data.source_url; }
    if (data.source_name !== undefined) { fields.push('source_name = @source_name'); values.source_name = data.source_name; }
    if (data.category !== undefined) { fields.push('category = @category'); values.category = data.category; }
    if (data.tags !== undefined) { fields.push('tags = @tags'); values.tags = data.tags; }

    getDb().prepare(`UPDATE knowledge_entries SET ${fields.join(', ')} WHERE id = @id`).run(values);
  },

  delete(id: number) {
    getDb().prepare('DELETE FROM knowledge_entries WHERE id = ?').run(id);
  },

  toggleFavorite(id: number) {
    getDb().prepare('UPDATE knowledge_entries SET is_favorited = 1 - is_favorited WHERE id = ?').run(id);
  },

  getCategories() {
    return getDb().prepare(
      'SELECT DISTINCT category, COUNT(*) as count FROM knowledge_entries GROUP BY category ORDER BY count DESC'
    ).all() as { category: string; count: number }[];
  },
};

/* ============================================
   全局搜索
   ============================================ */
export function globalSearch(query: string, limit = 20) {
  const db = getDb();
  const pattern = `%${query}%`;

  const leetcode = db.prepare(`
    SELECT id, title, title_cn, difficulty, category, 'leetcode' as source_type
    FROM leetcode_problems
    WHERE title LIKE ? OR title_cn LIKE ? OR tags LIKE ? OR solution_hint LIKE ?
    LIMIT ?
  `).all(pattern, pattern, pattern, pattern, limit) as unknown[];

  const java = db.prepare(`
    SELECT id, question as title, '' as title_cn, category, importance, 'java' as source_type
    FROM java_questions
    WHERE question LIKE ? OR answer LIKE ? OR tags LIKE ?
    LIMIT ?
  `).all(pattern, pattern, pattern, limit) as unknown[];

  const ai = db.prepare(`
    SELECT id, question as title, '' as title_cn, category, importance, 'ai' as source_type
    FROM ai_questions
    WHERE question LIKE ? OR answer LIKE ? OR tags LIKE ?
    LIMIT ?
  `).all(pattern, pattern, pattern, limit) as unknown[];

  const knowledge = db.prepare(`
    SELECT id, title, '' as title_cn, category, source_type, 'knowledge' as source_module
    FROM knowledge_entries
    WHERE title LIKE ? OR content LIKE ? OR tags LIKE ?
    LIMIT ?
  `).all(pattern, pattern, pattern, limit) as unknown[];

  return { leetcode, java, ai, knowledge };
}

/* ============================================
   种子数据初始化
   ============================================ */
export function isSeeded(): boolean {
  const db = getDb();
  const count = (db.prepare('SELECT COUNT(*) as c FROM leetcode_problems').get() as { c: number }).c;
  return count > 0;
}

/** 运行所有种子数据 */
export function runSeeds() {
  if (isSeeded()) return;
  try {
    const { seedLeetCode } = require('./seed-leetcode');
    const { seedJavaQuestions, seedAIQuestions, seedKnowledge } = require('./seed-data');
    seedLeetCode();
    seedJavaQuestions();
    seedAIQuestions();
    seedKnowledge();
    console.log('[DB] 种子数据初始化完成');
  } catch (e) {
    console.error('[DB] 种子数据初始化失败:', e);
  }
}
