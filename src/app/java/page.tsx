'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Coffee, ChevronDown, ChevronUp, CheckCircle2, Circle, Star, Flame } from 'lucide-react';

interface JavaQuestion {
  id: number;
  category: string;
  question: string;
  answer: string;
  tags: string;
  importance: number;
  is_favorited: number;
  created_at: string;
}

const categoryColors: Record<string, string> = {
  'Java基础': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  '集合框架': 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  '并发编程': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  'JVM': 'bg-red-500/10 text-red-600 border-red-500/20',
  'Spring': 'bg-green-500/10 text-green-600 border-green-500/20',
  '设计模式': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  '数据库': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  '微服务': 'bg-pink-500/10 text-pink-600 border-pink-500/20',
  '消息队列': 'bg-teal-500/10 text-teal-600 border-teal-500/20',
};

const heatLabels: Record<number, { label: string; color: string; bg: string }> = {
  5: { label: '必刷', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' },
  4: { label: '重点', color: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/20' },
  3: { label: '常考', color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  2: { label: '了解', color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
  1: { label: '选做', color: 'text-slate-500', bg: 'bg-slate-500/10 border-slate-500/20' },
};

function HeatStars({ rating }: { rating: number }) {
  const heat = heatLabels[rating] || heatLabels[3];
  return (
    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium border ${heat.bg} ${heat.color}`}>
      <Flame className="h-3 w-3" />
      <Star className="h-2.5 w-2.5 fill-current" />
      {rating}
      <span className="ml-0.5 opacity-80">{heat.label}</span>
    </span>
  );
}

export default function JavaPage() {
  const [questions, setQuestions] = useState<JavaQuestion[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('all');
  const [importance, setImportance] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const pageSize = 10;

  const load = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (category !== 'all') params.set('category', category);
    if (importance !== 'all') params.set('importance', importance);
    if (search) params.set('search', search);
    const res = await fetch(`/api/java?${params}`);
    const data = await res.json();
    setQuestions(data.data || []);
    setTotal(data.total || 0);
  }, [page, category, importance, search]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    async function loadCats() {
      const res = await fetch('/api/java?pageSize=1');
      const data = await res.json();
      if (data.categories) setCategories(data.categories.map((c: { category: string }) => c.category));
    }
    loadCats();
  }, []);

  const toggleFavorite = async (id: number) => {
    await fetch('/api/java', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggleFavorite', id }),
    });
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, is_favorited: 1 - q.is_favorited } : q));
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Coffee className="h-6 w-6 text-orange-500" />
          <h1 className="text-2xl font-bold">Java 热门面试题</h1>
          <Badge variant="secondary">{total} 题</Badge>
        </div>
        <p className="text-sm text-muted-foreground">涵盖基础、并发、JVM、Spring、数据库等核心知识，支持标记记忆状态</p>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="搜索题目..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
        </div>
        <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1); }}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="分类" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部分类</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={importance} onValueChange={(v) => { setImportance(v); setPage(1); }}>
          <SelectTrigger className="w-[130px]"><SelectValue placeholder="热度" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部热度</SelectItem>
            <SelectItem value="5">5星 必刷</SelectItem>
            <SelectItem value="4">4星 重点</SelectItem>
            <SelectItem value="3">3星 常考</SelectItem>
            <SelectItem value="2">2星 了解</SelectItem>
            <SelectItem value="1">1星 选做</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {questions.map((q) => (
          <Card key={q.id} className={`transition-all ${q.is_favorited ? 'border-green-500/30 bg-green-500/5' : ''}`}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <HeatStars rating={q.importance} />
                    <Badge className={`text-[10px] ${categoryColors[q.category] || 'bg-gray-500/10 text-gray-600'}`}>
                      {q.category}
                    </Badge>
                    {q.tags && <span className="text-xs text-muted-foreground">{q.tags}</span>}
                  </div>
                  <CardTitle className="text-base cursor-pointer hover:text-primary" onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}>
                    {q.question}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleFavorite(q.id)}>
                    {q.is_favorited ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}>
                    {expandedId === q.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            {expandedId === q.id && (
              <CardContent className="pt-0">
                <div className="rounded-lg bg-accent/50 p-4">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{q.answer}</p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

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
