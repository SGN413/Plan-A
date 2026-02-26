"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Activity,
    TrendingUp,
    MessageCircle,
    ChevronRight,
    ClipboardCheck,
    Award,
    Zap,
    X,
    LogOut
} from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    Tooltip
} from 'recharts';

const workloadData = [
    { day: '월', value: 40 },
    { day: '화', value: 75 },
    { day: '수', value: 30 },
    { day: '목', value: 85 },
    { day: '금', value: 60 },
    { day: '토', value: 0 },
    { day: '일', value: 0 },
];

export default function PlayerDashboardHome() {
    const router = useRouter();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const name = localStorage.getItem('plana_user_name');
        if (name) setUserName(name);
    }, []);

    const handleLogout = () => {
        if (confirm('로그아웃 하시겠습니까?')) {
            localStorage.clear();
            router.replace('/');
        }
    };
    return (
        <main className="min-h-screen bg-gray-50 pb-40 font-pretendard">
            {/* 1. Header & Greeting */}
            <header className="px-6 pt-10 pb-8 bg-white rounded-b-[40px] shadow-sm ring-1 ring-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 flex items-center justify-center">
                            <img src="/plana_logo.png" alt="PlanA" className="w-full h-auto" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-gray-900 tracking-tight">
                                {userName ? `안녕하세요, ${userName} 선수!` : '안녕하세요!'}
                            </h1>
                            <p className="text-[10px] font-bold text-gray-400">PlanA Academy • No. 10</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                            <Calendar size={20} />
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-400 border border-red-100"
                            title="로그아웃"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Status Highlight */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50/50 p-4 rounded-3xl border border-blue-100/50">
                        <span className="text-[10px] font-bold text-blue-500 block uppercase mb-1">Weekly Rank</span>
                        <div className="flex items-end space-x-1">
                            <span className="text-2xl font-black text-blue-900">Top 3</span>
                            <Award size={16} className="text-blue-500 mb-1.5" />
                        </div>
                    </div>
                    <div className="bg-orange-50/50 p-4 rounded-3xl border border-orange-100/50">
                        <span className="text-[10px] font-bold text-orange-500 block uppercase mb-1">Condition</span>
                        <div className="flex items-end space-x-1">
                            <span className="text-2xl font-black text-orange-900">92</span>
                            <Zap size={16} className="text-orange-500 mb-1.5" fill="currentColor" />
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. Today's Action Card */}
            <section className="px-6 -mt-4 relative z-10">
                <Link href="/player/check-in">
                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        className="bg-gray-900 rounded-[32px] p-6 shadow-xl shadow-gray-900/20 flex items-center justify-between overflow-hidden relative"
                    >
                        <div className="relative z-10">
                            <h3 className="text-white text-lg font-black leading-tight">오늘의 컨디션<br />체크하셨나요?</h3>
                            <p className="text-white/50 text-[11px] font-bold mt-2 uppercase tracking-widest flex items-center">
                                <ClipboardCheck size={12} className="mr-1.5 text-xion-red" />
                                Daily Check-in Pending
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-xion-red rounded-2xl flex items-center justify-center text-white shadow-lg shadow-xion-red/30 relative z-10">
                            <ChevronRight size={28} strokeWidth={3} />
                        </div>
                        {/* Decoration */}
                        <div className="absolute right-[-10%] top-[-10%] w-32 h-32 bg-xion-red/10 rounded-full blur-3xl"></div>
                    </motion.div>
                </Link>
            </section>

            {/* 3. Growth Insight (Chart) */}
            <section className="px-6 mt-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <TrendingUp size={18} className="text-xion-red" />
                        <h3 className="text-sm font-black text-gray-900 tracking-tight uppercase">My Growth Insight</h3>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">이번 주 운동량</span>
                </div>

                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-white">
                    <div className="w-full h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={workloadData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#E11D48" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#E11D48" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#E11D48"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                <Tooltip />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-xion-red"></div>
                            <span className="text-[11px] font-bold text-gray-900">목표 달성률 85%</span>
                        </div>
                        <button className="text-[11px] font-bold text-gray-400 flex items-center">
                            상세보기 <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </section>

            {/* 4. Coach Feedback Alert */}
            <section className="px-6 mt-8">
                <div className="flex items-center space-x-2 mb-4 px-1">
                    <MessageCircle size={18} className="text-blue-500" />
                    <h3 className="text-sm font-black text-gray-900 tracking-tight uppercase">Coach Feedback</h3>
                </div>
                <div className="bg-blue-600 rounded-[32px] p-5 shadow-lg shadow-blue-600/10 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-md border border-white/20">
                        <Zap size={22} fill="currentColor" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-white/90 font-bold leading-relaxed">
                            "오늘 스프린트 아주 좋았어. <br />하체 회복에 신경 써보자!"
                        </p>
                        <span className="text-[9px] text-white/50 font-medium mt-1 block">Main Coach • 1시간 전</span>
                    </div>
                </div>
            </section>
        </main>
    );
}
