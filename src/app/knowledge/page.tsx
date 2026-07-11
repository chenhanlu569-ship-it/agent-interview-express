'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Library, ExternalLink, ChevronDown, ChevronUp, Globe, User, BookOpen } from 'lucide-react';

interface KnowledgeEntry {
  id: number;
  title: string;
  content: string;
  source_url: string;
  source_type: string;
  tags: string;
  created_at: string;
  updated_at: string;
}

const sourceTypeConfig: Record<string, { icon: typeof Globe; label: string; color: string }> = {
  ai: { icon: Globe, label: 'AI搜索', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  personal: { icon: User, label: '个人上传', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
};

export default function KnowledgePage() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sourceType, setSourceType] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const pageSize = 10;

  const load = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (sourceType !== 'all') params.set('source_type', sourceType);
    if (search) params.set('search', search);
    const res = await fetch(`/api/knowledge?${params}`);
    const data = await res.json();
    setEntries(data.data || []);
    setTotal(data.total || 0);
  }, [page, sourceType, search]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Library className="h-6 w-6 text-emerald-500" />
          <h1 className="text-2xl font-bold">知识库</h1>
          <Badge variant="secondary">{total} 条</Badge>
        </div>
        <p className="text-sm text-muted-foreground">AI搜索知识（含出处）+ 个人上传知识，统一管理</p>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="搜索知识..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
        </div>
        <Select value={sourceType} onValueChange={(v) => { setSourceType(v); setPage(1); }}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="来源" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部来源</SelectItem>
            <SelectItem value="ai">AI搜索</SelectItem>
            <SelectItem value="personal">个人上传</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Entries */}
      <div className="space-y-3">
        {entries.map((entry) => {
          const srcConfig = sourceTypeConfig[entry.source_type] || sourceTypeConfig.personal;
          const SrcIcon = srcConfig.icon;
          return (
            <Card key={entry.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`text-[10px] ${srcConfig.color}`}>
                        <SrcIcon className="h-3 w-3 mr-1" />
                        {srcConfig.label}
                      </Badge>
                      {entry.tags && <span className="text-xs text-muted-foreground">{entry.tags}</span>}
                    </div>
                    <CardTitle className="text-base cursor-pointer hover:text-primary" onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}>
                      {entry.title}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {entry.source_url && (
                      <a href={entry.source_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </a>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}>
                      {expandedId === entry.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {expandedId === entry.id && (
                <CardContent className="pt-0">
                  <div className="rounded-lg bg-accent/50 p-4 space-y-3">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{entry.content}</p>
                    {entry.source_url && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-2">
                        <BookOpen className="h-3 w-3" />
                        <span>出处：</span>
                        <a href={entry.source_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {entry.source_url}
                        </a>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      创建于 {new Date(entry.created_at).toLocaleString('zh-CN')}
                      {entry.updated_at !== entry.created_at && ` · 更新于 ${new Date(entry.updated_at).toLocaleString('zh-CN')}`}
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
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
