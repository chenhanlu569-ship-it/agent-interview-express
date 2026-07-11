'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Heart, CheckCircle2, ExternalLink, Code2 } from 'lucide-react';

interface Problem {
  id: number;
  title: string;
  title_cn: string;
  difficulty: string;
  category: string;
  tags: string;
  description: string;
  leetcode_url: string;
  solution_hint: string;
  is_favorited: number;
  is_solved: number;
}

const difficultyColor: Record<string, string> = {
  Easy: 'bg-green-500/10 text-green-600 border-green-500/20',
  Medium: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  Hard: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export default function LeetCodePage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const pageSize = 15;

  const loadProblems = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (category !== 'all') params.set('category', category);
    if (difficulty !== 'all') params.set('difficulty', difficulty);
    if (search) params.set('search', search);

    const res = await fetch(`/api/leetcode?${params}`);
    const data = await res.json();
    setProblems(data.data || []);
    setTotal(data.total || 0);
  }, [page, category, difficulty, search]);

  useEffect(() => {
    loadProblems();
  }, [loadProblems]);

  useEffect(() => {
    async function loadCategories() {
      const res = await fetch('/api/leetcode?pageSize=1');
      const data = await res.json();
      if (data.categories) {
        setCategories(data.categories.map((c: { category: string }) => c.category));
      }
    }
    loadCategories();
  }, []);

  const toggleFavorite = async (id: number) => {
    await fetch('/api/leetcode', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggleFavorite', id }),
    });
    setProblems(prev => prev.map(p => p.id === id ? { ...p, is_favorited: 1 - p.is_favorited } : p));
  };

  const toggleSolved = async (id: number) => {
    await fetch('/api/leetcode', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggleSolved', id }),
    });
    setProblems(prev => prev.map(p => p.id === id ? { ...p, is_solved: 1 - p.is_solved } : p));
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Code2 className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold">LeetCode 150 热题</h1>
          <Badge variant="secondary">{total} 题</Badge>
        </div>
        <p className="text-sm text-muted-foreground">精选高频面试题，按类型分类，支持标记完成和收藏</p>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索题目..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1); }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部分类</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={difficulty} onValueChange={(v) => { setDifficulty(v); setPage(1); }}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="难度" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部难度</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Problem List */}
      <div className="space-y-2">
        {problems.map((p) => (
          <Card key={p.id} className={`transition-all ${p.is_solved ? 'border-green-500/30 bg-green-500/5' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <span className="w-10 text-sm font-mono text-muted-foreground">{p.id}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                      className="text-left hover:text-primary transition-colors"
                    >
                      <span className="font-medium">{p.title_cn}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{p.title}</span>
                    </button>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge className={`text-[10px] ${difficultyColor[p.difficulty]}`}>{p.difficulty}</Badge>
                    <span className="text-xs text-muted-foreground">{p.category}</span>
                    {p.tags && <span className="text-xs text-muted-foreground">· {p.tags}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleSolved(p.id)}>
                    <CheckCircle2 className={`h-4 w-4 ${p.is_solved ? 'text-green-500 fill-green-500' : 'text-muted-foreground'}`} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleFavorite(p.id)}>
                    <Heart className={`h-4 w-4 ${p.is_favorited ? 'text-red-500 fill-red-500' : 'text-muted-foreground'}`} />
                  </Button>
                  <a href={p.leetcode_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </a>
                </div>
              </div>
              {expandedId === p.id && (
                <div className="mt-3 pl-12 space-y-2 border-t pt-3">
                  <p className="text-sm text-muted-foreground">{p.description}</p>
                  <div className="rounded-lg bg-accent/50 p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">解题思路</p>
                    <p className="text-sm">{p.solution_hint}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>上一页</Button>
          <span className="text-sm text-muted-foreground">{page} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>下一页</Button>
        </div>
      )}
    </div>
  );
}
