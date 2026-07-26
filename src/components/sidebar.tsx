'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BookOpen, Code2, Coffee, Brain, Library, Settings, Home, Search, Upload,
} from 'lucide-react';

const navItems = [
  { href: '/', label: '首页', icon: Home },
  { href: '/leetcode', label: 'LeetCode 热题', icon: Code2 },
  { href: '/java', label: 'Java 面试题', icon: Coffee },
  { href: '/ai-agent', label: 'AI Agent 面试', icon: Brain },
  { href: '/knowledge', label: '知识库', icon: Library },
  { href: '/batch-upload', label: '批量上传', icon: Upload },
  { href: '/admin', label: '运维管理', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-60 border-r bg-background">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold">Agent 面试直通车</h1>
            <p className="text-[10px] text-muted-foreground">面试备考一站式平台</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-3">
          <div className="flex items-center gap-2 rounded-lg bg-accent/50 px-3 py-2">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">全局搜索: Ctrl+K</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
