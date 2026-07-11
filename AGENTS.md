# Agent 面试直通车

## 项目概览
一站式面试准备平台，集成 LeetCode 150 热题刷题、Java 热门面试题记忆总结、AI Agent 面试题收集，支持个人知识上传管理与全局搜索。数据存储采用本地 SQLite。

## 技术栈
- **Framework**: Next.js 16 (App Router)
- **Core**: React 19 + TypeScript 5
- **UI**: shadcn/ui + Tailwind CSS 4
- **Database**: SQLite (better-sqlite3)
- **Server**: Next.js API Routes

## 文件结构
```
src/
├── app/
│   ├── layout.tsx              # 全局布局 + 侧边栏导航
│   ├── page.tsx                # 首页仪表盘
│   ├── globals.css             # 全局样式
│   ├── leetcode/page.tsx       # LeetCode 150 热题刷题页
│   ├── java/page.tsx           # Java 面试题记忆总结页
│   ├── ai-agent/page.tsx       # AI Agent 面试题收集页
│   ├── knowledge/page.tsx      # 个人知识管理页
│   ├── admin/page.tsx          # 运维管理后台
│   └── api/
│       ├── leetcode/route.ts   # LeetCode CRUD API
│       ├── java/route.ts       # Java 面试题 CRUD API
│       ├── ai/route.ts         # AI 面试题 CRUD API
│       ├── knowledge/route.ts  # 知识管理 CRUD API
│       └── search/route.ts     # 全局搜索 API
├── components/
│   ├── ui/                     # shadcn/ui 组件
│   └── sidebar.tsx             # 侧边栏导航组件
└── lib/
    ├── db.ts                   # SQLite 数据库层 + 仓储模式
    ├── types.ts                # TypeScript 类型定义
    ├── seed-leetcode.ts        # LeetCode 150 种子数据
    └── seed-data.ts            # Java/AI/知识种子数据
```

## 核心模块说明

### 数据库层 (lib/db.ts)
- **SQLite 初始化**: 自动建表 + 种子数据填充（幂等）
- **仓储模式**: `leetcodeRepo` / `javaRepo` / `aiRepo` / `knowledgeRepo`
- **通用分页查询**: `paginatedQuery` 支持过滤、排序、分页
- **全局搜索**: `globalSearch` 跨表模糊匹配

### 数据表结构
| 表名 | 说明 | 核心字段 |
|------|------|----------|
| leetcode_problems | LeetCode 热题 | title, difficulty, category, leetcode_url, solution_hint, is_solved, is_favorited |
| java_questions | Java 面试题 | category, question, answer, importance, is_favorited |
| ai_questions | AI Agent 面试题 | category, question, answer, importance, is_favorited |
| knowledge_entries | 知识条目 | title, content, source_type(ai_search/personal), source_url, source_name |

### API 接口
| 路径 | 方法 | 功能 |
|------|------|------|
| /api/leetcode | GET | 分页查询 LeetCode 题目（支持 difficulty/category/search 过滤） |
| /api/leetcode | POST | 新增题目 |
| /api/leetcode | PATCH | 标记已做/收藏 |
| /api/leetcode | DELETE | 删除题目 |
| /api/java | GET/POST/PATCH/DELETE | Java 面试题 CRUD |
| /api/ai | GET/POST/PATCH/DELETE | AI 面试题 CRUD |
| /api/knowledge | GET/POST/PUT/DELETE | 知识条目 CRUD |
| /api/search | GET | 全局搜索（q 参数） |

## 种子数据
- **LeetCode 150**: 涵盖数组、链表、滑动窗口、二叉树、图、动态规划、贪心等分类
- **Java 面试题**: 覆盖 Java 基础、集合、并发、JVM、Spring、设计模式等
- **AI Agent 面试题**: 覆盖 LLM 基础、Prompt 工程、RAG、Agent 框架、工具调用等
- **知识条目**: 预置 AI 搜索知识（标明出处）+ 个人知识示例

## 功能特性
1. **刷题进度追踪**: 标记已做/未完成，收藏重点题目
2. **分类筛选**: 按难度/分类/标签快速定位
3. **全文搜索**: 跨所有模块的全局模糊搜索
4. **知识来源标注**: AI 搜索知识标明出处 URL 和来源名称
5. **个人知识管理**: 支持上传个人笔记，运维后台增删改查
6. **响应式设计**: 适配桌面端和移动端
