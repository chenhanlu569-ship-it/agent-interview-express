'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Plus, Pencil, Trash2, Search, Globe, User, Save, X } from 'lucide-react';

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

const emptyEntry = { title: '', content: '', source_url: '', source_type: 'personal', tags: '' };

export default function AdminPage() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sourceType, setSourceType] = useState('all');
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<KnowledgeEntry | null>(null);
  const [form, setForm] = useState(emptyEntry);
  const [saving, setSaving] = useState(false);
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

  const openCreate = () => {
    setEditingEntry(null);
    setForm(emptyEntry);
    setDialogOpen(true);
  };

  const openEdit = (entry: KnowledgeEntry) => {
    setEditingEntry(entry);
    setForm({ title: entry.title, content: entry.content, source_url: entry.source_url, source_type: entry.source_type, tags: entry.tags });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    try {
      if (editingEntry) {
        await fetch('/api/knowledge', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingEntry.id, ...form }),
        });
      } else {
        await fetch('/api/knowledge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      setDialogOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除此条目？')) return;
    await fetch('/api/knowledge', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    load();
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Settings className="h-6 w-6 text-gray-500" />
              <h1 className="text-2xl font-bold">知识管理后台</h1>
              <Badge variant="secondary">{total} 条</Badge>
            </div>
            <p className="text-sm text-muted-foreground">管理个人知识库，添加、编辑、删除知识条目</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4 mr-1" />
                新增条目
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingEntry ? '编辑知识条目' : '新增知识条目'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">标题 *</label>
                  <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="知识条目标题" />
                </div>
                <div>
                  <label className="text-sm font-medium">内容 *</label>
                  <Textarea value={form.content} onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))} placeholder="知识内容..." rows={8} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">来源类型</label>
                    <Select value={form.source_type} onValueChange={(v) => setForm(f => ({ ...f, source_type: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">个人上传</SelectItem>
                        <SelectItem value="ai">AI搜索</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">来源URL</label>
                    <Input value={form.source_url} onChange={(e) => setForm(f => ({ ...f, source_url: e.target.value }))} placeholder="https://..." />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">标签</label>
                  <Input value={form.tags} onChange={(e) => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="标签1,标签2" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    <X className="h-4 w-4 mr-1" />取消
                  </Button>
                  <Button onClick={handleSave} disabled={saving || !form.title.trim() || !form.content.trim()}>
                    <Save className="h-4 w-4 mr-1" />{saving ? '保存中...' : '保存'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="搜索..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
        </div>
        <Select value={sourceType} onValueChange={(v) => { setSourceType(v); setPage(1); }}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部来源</SelectItem>
            <SelectItem value="ai">AI搜索</SelectItem>
            <SelectItem value="personal">个人上传</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Entries Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">标题</th>
                  <th className="text-left p-3 font-medium w-24">来源</th>
                  <th className="text-left p-3 font-medium w-32">标签</th>
                  <th className="text-left p-3 font-medium w-36">更新时间</th>
                  <th className="text-right p-3 font-medium w-24">操作</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-3">
                      <div className="font-medium truncate max-w-xs">{entry.title}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-xs mt-0.5">{entry.content.slice(0, 80)}...</div>
                    </td>
                    <td className="p-3">
                      <Badge className={`text-[10px] ${entry.source_type === 'ai' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'}`}>
                        {entry.source_type === 'ai' ? <Globe className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                        {entry.source_type === 'ai' ? 'AI搜索' : '个人'}
                      </Badge>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">{entry.tags || '-'}</td>
                    <td className="p-3 text-xs text-muted-foreground">{new Date(entry.updated_at).toLocaleString('zh-CN')}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(entry)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600" onClick={() => handleDelete(entry.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">暂无数据</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>上一页</Button>
          <span className="text-sm text-muted-foreground">{page} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>下一页</Button>
        </div>
      )}
    </div>
  );
}
