'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImagePlus, Send, Upload, FileText, Loader2, Plus, X, MessageSquare, BookOpen } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface KnowledgeEntry {
  title: string;
  content: string;
  category: string;
  source_type: string;
  source_name: string;
  images?: string[];
}

export default function KnowledgeQAPage() {
  // Knowledge Storage State
  const [knowledgeTitle, setKnowledgeTitle] = useState('');
  const [knowledgeContent, setKnowledgeContent] = useState('');
  const [knowledgeCategory, setKnowledgeCategory] = useState('');
  const [knowledgeSource, setKnowledgeSource] = useState('个人录入');
  const [pastedImages, setPastedImages] = useState<Array<{ url: string; preview: string }>>([]);
  const [isSaving, setIsSaving] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Q&A State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Handle Ctrl+V paste for images
  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) continue;

        const preview = URL.createObjectURL(file);

        // Upload to server
        const formData = new FormData();
        formData.append('file', file);

        try {
          const res = await fetch('/api/upload-image', { method: 'POST', body: formData });
          const data = await res.json();
          if (data.success) {
            setPastedImages(prev => [...prev, { url: data.url, preview }]);
          }
        } catch {
          setPastedImages(prev => [...prev, { url: preview, preview }]);
        }
      }
    }
  }, []);

  // Handle file input
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      const preview = URL.createObjectURL(file);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload-image', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) {
          setPastedImages(prev => [...prev, { url: data.url, preview }]);
        }
      } catch {
        setPastedImages(prev => [...prev, { url: preview, preview }]);
      }
    }
    e.target.value = '';
  }, []);

  // Save knowledge
  const handleSaveKnowledge = async () => {
    if (!knowledgeTitle.trim() && !knowledgeContent.trim() && pastedImages.length === 0) return;
    setIsSaving(true);

    try {
      const contentWithImages = [
        knowledgeContent,
        ...pastedImages.map((img, i) => `[图片${i + 1}](${img.url})`),
      ].filter(Boolean).join('\n\n');

      const title = knowledgeTitle.trim() || knowledgeContent.slice(0, 30) + '...';

      const res = await fetch('/api/batch-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: 'knowledge',
          items: [{
            title,
            content: contentWithImages,
            category: knowledgeCategory || '个人知识',
            source_type: 'personal',
            source_name: knowledgeSource || '个人录入',
          }],
        }),
      });

      const data = await res.json();
      if (data.success) {
        setKnowledgeTitle('');
        setKnowledgeContent('');
        setKnowledgeCategory('');
        setPastedImages([]);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Send Q&A message
  const handleSendQuestion = async () => {
    if (!currentQuestion.trim() || isStreaming) return;
    const question = currentQuestion.trim();
    setCurrentQuestion('');
    setChatMessages(prev => [...prev, { role: 'user', content: question }]);
    setIsStreaming(true);

    try {
      const history = chatMessages.slice(-6);
      const res = await fetch('/api/knowledge-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, history }),
      });

      if (!res.ok) throw new Error('Request failed');

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let assistantContent = '';
      setChatMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantContent += parsed.content;
                setChatMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
                  return updated;
                });
              }
            } catch { /* skip */ }
          }
        }
      }
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: `回答生成失败: ${error}` }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const removeImage = (index: number) => {
    setPastedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <MessageSquare className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">知识问答</h1>
          <p className="text-muted-foreground">存储知识，智能问答</p>
        </div>
      </div>

      <Tabs defaultValue="qa" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="qa" className="gap-2">
            <MessageSquare className="h-4 w-4" /> 知识问答
          </TabsTrigger>
          <TabsTrigger value="store" className="gap-2">
            <BookOpen className="h-4 w-4" /> 知识存储
          </TabsTrigger>
        </TabsList>

        {/* Knowledge Q&A Tab */}
        <TabsContent value="qa">
          <Card className="h-[calc(100vh-240px)] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                基于知识库的智能问答
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                提问面试相关问题，AI将基于你的知识库内容进行回答
              </p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden p-4 pt-0">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4 pb-4">
                  {chatMessages.length === 0 && (
                    <div className="text-center text-muted-foreground py-12 space-y-3">
                      <MessageSquare className="h-12 w-12 mx-auto opacity-20" />
                      <p>开始提问吧！AI会基于你的知识库回答</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {['HashMap底层原理', 'Redis缓存穿透怎么解决', '线程池核心参数', 'Spring AOP原理'].map(q => (
                          <Button key={q} variant="outline" size="sm" onClick={() => { setCurrentQuestion(q); }}>
                            {q}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg px-4 py-3 text-sm whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted border'
                      }`}>
                        {msg.content || (isStreaming && i === chatMessages.length - 1 ? '...' : '')}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>
              <div className="flex gap-2 pt-4 border-t">
                <Input
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendQuestion(); } }}
                  placeholder="输入面试问题..."
                  disabled={isStreaming}
                  className="flex-1"
                />
                <Button onClick={handleSendQuestion} disabled={isStreaming || !currentQuestion.trim()}>
                  {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Knowledge Storage Tab */}
        <TabsContent value="store">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" /> 文本知识
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={knowledgeTitle}
                  onChange={(e) => setKnowledgeTitle(e.target.value)}
                  placeholder="标题（可选，不填自动截取内容前30字）"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={knowledgeCategory}
                    onChange={(e) => setKnowledgeCategory(e.target.value)}
                    placeholder="分类，如：Java基础"
                  />
                  <Input
                    value={knowledgeSource}
                    onChange={(e) => setKnowledgeSource(e.target.value)}
                    placeholder="来源，如：小红书"
                  />
                </div>
                <Textarea
                  ref={contentRef}
                  value={knowledgeContent}
                  onChange={(e) => setKnowledgeContent(e.target.value)}
                  onPaste={handlePaste}
                  placeholder="输入知识内容...&#10;&#10;提示：直接 Ctrl+V 可以粘贴截图！"
                  className="min-h-[200px]"
                />
                <Button onClick={handleSaveKnowledge} disabled={isSaving} className="w-full gap-2">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  保存到知识库
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ImagePlus className="h-4 w-4" /> 图片知识
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Ctrl+V 粘贴截图 或 点击上传
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">点击选择图片 或 Ctrl+V 粘贴</p>
                  </label>
                </div>
                {pastedImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {pastedImages.map((img, i) => (
                      <div key={i} className="relative group">
                        <img src={img.preview} alt={`图片${i + 1}`} className="w-full h-32 object-cover rounded border" />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(i)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <Badge variant="secondary" className="absolute bottom-1 left-1 text-[10px]">
                          图片{i + 1}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
                <Button onClick={handleSaveKnowledge} disabled={isSaving || (!knowledgeContent.trim() && pastedImages.length === 0)} className="w-full gap-2">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  保存图片到知识库
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
