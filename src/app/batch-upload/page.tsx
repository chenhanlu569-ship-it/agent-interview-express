'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ParsedQuestion {
  question: string;
  answer: string;
  category: string;
  tags: string;
  importance: number;
}

export default function BatchUploadPage() {
  const [targetModule, setTargetModule] = useState<'java' | 'ai' | 'knowledge'>('java');
  const [textInput, setTextInput] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [ocrResults, setOcrResults] = useState<ParsedQuestion[][]>([]);
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(prev => [...prev, ...files]);
    const previews = files.map(f => URL.createObjectURL(f));
    setImagePreviews(prev => [...prev, ...previews]);
  }, []);

  const removeImage = useCallback((index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
    setOcrResults(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleOcrExtract = useCallback(async () => {
    if (imageFiles.length === 0) return;
    setOcrLoading(true);
    try {
      const allResults: ParsedQuestion[][] = [];
      for (const file of imageFiles) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        const res = await fetch('/api/ocr-extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64 }),
        });
        const data = await res.json();
        if (data.success && data.questions) {
          allResults.push(data.questions);
        }
      }
      setOcrResults(allResults);
      const allQ = allResults.flat();
      setParsedQuestions(prev => [...prev, ...allQ]);
    } catch (err) {
      setResult('OCR提取失败: ' + String(err));
    } finally {
      setOcrLoading(false);
    }
  }, [imageFiles]);

  const handleTextParse = useCallback(() => {
    if (!textInput.trim()) return;
    const lines = textInput.trim().split('\n').filter(l => l.trim());
    const questions: ParsedQuestion[] = [];
    let currentQ: Partial<ParsedQuestion> = {};

    for (const line of lines) {
      const qMatch = line.match(/^(?:Q|题目|问)[：:]\s*(.+)/i);
      const aMatch = line.match(/^(?:A|答案|答)[：:]\s*(.+)/i);
      const cMatch = line.match(/^(?:分类|类别)[：:]\s*(.+)/i);
      const tMatch = line.match(/^(?:标签|Tags)[：:]\s*(.+)/i);
      const iMatch = line.match(/^(?:重要性|Importance)[：:]\s*(\d)/i);

      if (qMatch) {
        if (currentQ.question) {
          questions.push({
            question: currentQ.question,
            answer: currentQ.answer || '',
            category: currentQ.category || '其他',
            tags: currentQ.tags || '',
            importance: currentQ.importance || 3,
          });
        }
        currentQ = { question: qMatch[1] };
      } else if (aMatch) {
        currentQ.answer = (currentQ.answer || '') + (currentQ.answer ? '\n' : '') + aMatch[1];
      } else if (cMatch) {
        currentQ.category = cMatch[1];
      } else if (tMatch) {
        currentQ.tags = tMatch[1];
      } else if (iMatch) {
        currentQ.importance = parseInt(iMatch[1]);
      } else if (currentQ.question) {
        currentQ.answer = (currentQ.answer || '') + '\n' + line;
      } else {
        questions.push({ question: line, answer: '', category: '其他', tags: '', importance: 3 });
      }
    }
    if (currentQ.question) {
      questions.push({
        question: currentQ.question,
        answer: currentQ.answer || '',
        category: currentQ.category || '其他',
        tags: currentQ.tags || '',
        importance: currentQ.importance || 3,
      });
    }
    setParsedQuestions(prev => [...prev, ...questions]);
  }, [textInput]);

  const updateQuestion = useCallback((index: number, field: keyof ParsedQuestion, value: string | number) => {
    setParsedQuestions(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  }, []);

  const removeQuestion = useCallback((index: number) => {
    setParsedQuestions(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (parsedQuestions.length === 0) return;
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/batch-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module: targetModule, questions: parsedQuestions }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(`成功导入 ${data.count} 条数据到 ${targetModule} 模块`);
        setParsedQuestions([]);
        setTextInput('');
      } else {
        setResult('导入失败: ' + (data.error || '未知错误'));
      }
    } catch (err) {
      setResult('导入失败: ' + String(err));
    } finally {
      setLoading(false);
    }
  }, [parsedQuestions, targetModule]);

  const categoryOptions: Record<string, string[]> = {
    java: ['Java基础', '集合', '并发编程', 'JVM', 'Spring', '数据库', 'Redis', '微服务', '设计模式', '消息队列'],
    ai: ['LLM基础', 'Prompt工程', 'RAG', 'Agent框架', '工具调用', '模型部署', '评估优化', '多模态'],
    knowledge: ['面试算法', 'Java', 'AI Agent', '数据库', '架构', 'JVM', '运维'],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">批量上传题库</h1>
          <p className="text-muted-foreground mt-1">支持文字粘贴和图片OCR提取，批量导入面试题到知识库</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>目标模块</CardTitle>
            <CardDescription>选择要导入的模块</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {(['java', 'ai', 'knowledge'] as const).map(mod => (
                <Button key={mod} variant={targetModule === mod ? 'default' : 'outline'} onClick={() => setTargetModule(mod)}>
                  {mod === 'java' ? 'Java面试题' : mod === 'ai' ? 'AI面试题' : '知识库'}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="text">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">文字粘贴</TabsTrigger>
            <TabsTrigger value="image">图片上传(OCR)</TabsTrigger>
          </TabsList>

          <TabsContent value="text">
            <Card>
              <CardHeader>
                <CardTitle>粘贴面试题内容</CardTitle>
                <CardDescription>支持多种格式：Q:/A: 格式、题目：/答案：格式、每行一道题</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  placeholder={`示例格式1（Q&A）:\nQ: HashMap底层实现原理？\nA: JDK1.8采用数组+链表+红黑树\n分类: 集合\n标签: HashMap,底层\n重要性: 5\n\n示例格式2（每行一题）:\nConcurrentHashMap实现原理？\nJVM垃圾回收算法有哪些？`}
                  rows={12}
                  className="font-mono text-sm"
                />
                <Button onClick={handleTextParse} disabled={!textInput.trim()}>
                  解析文本
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="image">
            <Card>
              <CardHeader>
                <CardTitle>上传面试题图片</CardTitle>
                <CardDescription>支持JPG/PNG格式，AI自动识别图片中的面试题内容</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input type="file" accept="image/*" multiple onChange={handleImageChange} className="max-w-xs" />
                  <Button onClick={handleOcrExtract} disabled={imageFiles.length === 0 || ocrLoading}>
                    {ocrLoading ? 'AI识别中...' : 'AI提取题目'}
                  </Button>
                </div>
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="relative group">
                        <img src={src} alt={`图片${i + 1}`} className="w-full h-32 object-cover rounded border" />
                        <Button variant="destructive" size="sm" className="absolute top-1 right-1 opacity-0 group-hover:opacity-100" onClick={() => removeImage(i)}>×</Button>
                        {ocrResults[i] && <Badge variant="secondary" className="absolute bottom-1 left-1">{ocrResults[i].length}题</Badge>}
                      </div>
                    ))}
                  </div>
                )}
                {ocrLoading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    AI正在识别图片内容，请稍候...
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {parsedQuestions.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>解析结果预览 ({parsedQuestions.length} 题)</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setParsedQuestions([])}>清空</Button>
                  <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? '导入中...' : `导入到${targetModule === 'java' ? 'Java' : targetModule === 'ai' ? 'AI' : '知识库'}模块`}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {parsedQuestions.map((q, i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 space-y-2">
                        <Input value={q.question} onChange={e => updateQuestion(i, 'question', e.target.value)} className="font-medium" placeholder="题目" />
                        <Textarea value={q.answer} onChange={e => updateQuestion(i, 'answer', e.target.value)} rows={2} placeholder="答案" className="text-sm" />
                        <div className="flex gap-3">
                          <Select value={q.category} onValueChange={v => updateQuestion(i, 'category', v)}>
                            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {(categoryOptions[targetModule] || []).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <Input value={q.tags} onChange={e => updateQuestion(i, 'tags', e.target.value)} placeholder="标签(逗号分隔)" className="w-40" />
                          <Select value={String(q.importance)} onValueChange={v => updateQuestion(i, 'importance', Number(v))}>
                            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5★ 必刷</SelectItem>
                              <SelectItem value="4">4★ 重点</SelectItem>
                              <SelectItem value="3">3★ 常考</SelectItem>
                              <SelectItem value="2">2★ 了解</SelectItem>
                              <SelectItem value="1">1★ 选学</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive shrink-0" onClick={() => removeQuestion(i)}>删除</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card>
            <CardContent className="pt-6">
              <p className={result.startsWith('成功') ? 'text-green-600' : 'text-destructive'}>{result}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
