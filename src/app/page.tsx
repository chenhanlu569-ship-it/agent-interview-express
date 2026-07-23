'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code2, Coffee, Brain, Library, TrendingUp, Target, BookOpen, Star, Dice5, ExternalLink, Lightbulb } from 'lucide-react';

interface Stats {
  leetcode: { total: number; solved: number; easy: number; medium: number; hard: number };
  java: { total: number };
  ai: { total: number };
  knowledge: { total: number };
}

interface DailyQuestion {
  id: number;
  title: string;
  title_cn: string;
  difficulty: string;
  category: string;
  tags: string;
  description: string;
  leetcode_url: string;
  solution_hint: string;
  heat_rating: number;
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [dailyQ, setDailyQ] = useState<DailyQuestion | null>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    async function loadStats() {
      try {
        const [lcRes, javaRes, aiRes, knRes] = await Promise.all([
          fetch('/api/leetcode?pageSize=1'),
          fetch('/api/java?pageSize=1'),
          fetch('/api/ai?pageSize=1'),
          fetch('/api/knowledge?pageSize=1'),
        ]);
        const [lc, java, ai, kn] = await Promise.all([lcRes.json(), javaRes.json(), aiRes.json(), knRes.json()]);
        setStats({
          leetcode: { total: lc.total, solved: lc.data?.filter?.((p: { is_solved: number }) => p.is_solved)?.length || 0, easy: lc.easy || 0, medium: lc.medium || 0, hard: lc.hard || 0 },
          java: { total: java.total },
          ai: { total: ai.total },
          knowledge: { total: kn.total },
        });
      } catch {
        setStats({
          leetcode: { total: 150, solved: 0, easy: 40, medium: 80, hard: 30 },
          java: { total: 48 },
          ai: { total: 30 },
          knowledge: { total: 10 },
        });
      }
    }

    async function loadDaily() {
      try {
        const res = await fetch('/api/daily-question');
        if (res.ok) {
          const data = await res.json();
          setDailyQ(data);
        }
      } catch { /* ignore */ }
    }

    loadStats();
    loadDaily();
  }, []);

  const modules = [
    {
      href: '/leetcode',
      icon: Code2,
      title: 'LeetCode 150 热题',
      desc: '精选150道高频面试题，按类型分类，支持标记进度',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      count: stats?.leetcode.total || 150,
    },
    {
      href: '/java',
      icon: Coffee,
      title: 'Java 热门面试题',
      desc: '涵盖基础、并发、JVM、Spring、数据库等核心知识',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      count: stats?.java.total || 48,
    },
    {
      href: '/ai-agent',
      icon: Brain,
      title: 'AI Agent 面试题',
      desc: 'LLM、Prompt、RAG、Agent框架、微调等前沿话题',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      count: stats?.ai.total || 30,
    },
    {
      href: '/knowledge',
      icon: Library,
      title: '知识库',
      desc: 'AI搜索知识（含出处）+ 个人上传知识，统一管理',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      count: stats?.knowledge.total || 10,
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Agent 面试直通车</h1>
        <p className="mt-2 text-muted-foreground">
          一站式面试备考平台 — LeetCode刷题 · Java八股文 · AI Agent前沿 · 知识管理
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-blue-500/10 p-2">
              <Target className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.leetcode.total || 150}</p>
              <p className="text-xs text-muted-foreground">LeetCode 热题</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-orange-500/10 p-2">
              <Coffee className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.java.total || 48}</p>
              <p className="text-xs text-muted-foreground">Java 面试题</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-purple-500/10 p-2">
              <Brain className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.ai.total || 30}</p>
              <p className="text-xs text-muted-foreground">AI Agent 面试题</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-emerald-500/10 p-2">
              <BookOpen className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.knowledge.total || 10}</p>
              <p className="text-xs text-muted-foreground">知识条目</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Question */}
      {dailyQ && (
        <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Dice5 className="h-5 w-5 text-primary" />
                每日一题
                <span className="text-xs font-normal text-muted-foreground">
                  {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}
                </span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={dailyQ.difficulty === 'Hard' ? 'destructive' : 'default'}>
                  {dailyQ.difficulty === 'Hard' ? '困难' : '中等'}
                </Badge>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < dailyQ.heat_rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="text-xl font-semibold mb-1">
              {dailyQ.title_cn}
              <span className="text-sm font-normal text-muted-foreground ml-2">{dailyQ.title}</span>
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline">{dailyQ.category}</Badge>
              {dailyQ.tags?.split(',').map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag.trim()}</Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-4">{dailyQ.description}</p>
            <div className="flex items-center gap-3">
              <a
                href={dailyQ.leetcode_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                开始做题
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button
                onClick={() => setShowHint(!showHint)}
                className="inline-flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
              >
                <Lightbulb className="h-3.5 w-3.5" />
                {showHint ? '隐藏提示' : '查看提示'}
              </button>
            </div>
            {showHint && (
              <div className="mt-3 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <span className="font-medium">思路提示：</span>{dailyQ.solution_hint}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Module Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4">
        {modules.map((mod) => (
          <Link key={mod.href} href={mod.href}>
            <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg ${mod.bg} p-2`}>
                      <mod.icon className={`h-5 w-5 ${mod.color}`} />
                    </div>
                    <CardTitle className="text-base">{mod.title}</CardTitle>
                  </div>
                  <Badge variant="secondary">{mod.count} 题</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{mod.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Heat Rating Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4" />
            面试热度评级说明
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3">
            {[
              { stars: 5, label: '必刷', desc: '面试极高频，几乎必问', color: 'text-red-500' },
              { stars: 4, label: '重点', desc: '高频考点，频繁出现', color: 'text-orange-500' },
              { stars: 3, label: '常考', desc: '中等频率，经常考察', color: 'text-yellow-500' },
              { stars: 2, label: '了解', desc: '偶有涉及，掌握即可', color: 'text-blue-500' },
              { stars: 1, label: '选学', desc: '低频考点，拓展知识', color: 'text-gray-500' },
            ].map((item) => (
              <div key={item.stars} className="space-y-1">
                <div className="flex items-center gap-1">
                  {Array.from({ length: item.stars }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 fill-current ${item.color}`} />
                  ))}
                  <span className={`text-sm font-medium ${item.color}`}>{item.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            热度评级综合来源于小红书、微信公众号、B站、LeetCode等平台的面试面经数据分析
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
