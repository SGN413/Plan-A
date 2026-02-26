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
    { label: '홈', icon: Home, href: '/coach' },
    { label: '메시지', icon: MessageSquare, href: '/coach/feedback' },
    { label: '일정', icon: Calendar, href: '/coach/schedule' },
    { label: '데이터', icon: BarChart3, href: '/coach/physical' },
    { label: '설정', icon: Settings, href: '/coach/settings' },
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
        <div className="fixed bottom-8 left-0 right-0 px-6 z-50">
            <nav className="bg-gray-900/90 backdrop-blur-xl rounded-[32px] px-4 py-3 flex justify-between items-center shadow-[0_20px_40px_rgba(0,0,0,0.2)] border border-white/10">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col items-center justify-center space-y-1 group flex-1 py-1"
                        >
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                className={cn(
                                    "transition-all duration-300",
                                    isActive ? "text-white" : "text-gray-500 group-hover:text-gray-300"
                                )}
                            >
                                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-dot"
                                        className="w-1 h-1 bg-white rounded-full mx-auto mt-0.5"
                                    />
                                )}
                            </motion.div>
                            <span className={cn(
                                "text-[9px] font-black tracking-tighter transition-all duration-300",
                                isActive ? "text-white" : "text-gray-500 group-hover:text-gray-300"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
