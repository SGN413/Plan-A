"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Users,
    ClipboardList,
    Activity,
    Calendar,
    MessageSquare,
    BarChart3,
    CreditCard,
    MoreHorizontal,
    Home,
    Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface NavItem {
    label: string;
    icon: React.ElementType;
    href: string;
}

const coachNavItems: NavItem[] = [
    { label: '홈', icon: Users, href: '/coach' },
    { label: '메시지', icon: MessageSquare, href: '/coach/feedback' },
    { label: '일정', icon: Calendar, href: '/coach/schedule' },
    { label: '데이터', icon: BarChart3, href: '/coach/physical' },
    { label: '결제', icon: CreditCard, href: '/coach/billing' },
];

const playerNavItems: NavItem[] = [
    { label: '홈', icon: Home, href: '/player' },
    { label: '일정', icon: Calendar, href: '/player/schedule' },
    { label: '성장', icon: BarChart3, href: '/player/growth' },
    { label: '설정', icon: Settings, href: '/player/settings' },
];

export default function BottomNav() {
    const pathname = usePathname();
    const isCoach = pathname.startsWith('/coach');
    const isPlayer = pathname.startsWith('/player');
    const navItems = isCoach ? coachNavItems : isPlayer ? playerNavItems : [];

    if (navItems.length === 0) return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 safe-area-bottom z-50 flex justify-between items-center shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex flex-col items-center justify-center space-y-1 group flex-1"
                    >
                        <div className={cn(
                            "transition-all duration-200",
                            isActive ? "text-xion-red" : "text-gray-400 group-hover:text-gray-600"
                        )}>
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className={cn(
                            "text-[10px] font-bold transition-all duration-200 tracking-tight",
                            isActive ? "text-xion-red" : "text-gray-400 group-hover:text-gray-600"
                        )}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
