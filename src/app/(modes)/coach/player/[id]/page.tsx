"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChevronLeft,
    MessageSquare,
    TrendingUp,
    Activity,
    StickyNote,
    Send,
    UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis
} from 'recharts';
import { PLAYERS } from '@/constants/players';

// --- Mock Data ---
const workloadData = [
    { day: '월', value: 65 },
    { day: '화', value: 80 },
    { day: '수', value: 45 },
    { day: '목', value: 90 },
    { day: '금', value: 70 },
    { day: '토', value: 30 },
    { day: '일', value: 0 },
];

const physicalData = [
    { subject: 'Speed', A: 85, fullMark: 100 },
    { subject: 'Power', A: 70, fullMark: 100 },
    { subject: 'Stamina', A: 90, fullMark: 100 },
    { subject: 'Skill', A: 75, fullMark: 100 },
    { subject: 'Passing', A: 80, fullMark: 100 },
    { subject: 'Defense', A: 65, fullMark: 100 },
];

interface Memo {
    id: number;
    content: string;
    date: string;
}

export default function PlayerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const router = useRouter();
    const [memo, setMemo] = useState('');
    const [memos, setMemos] = useState<Memo[]>([]); // 초기 메모 비움

    // ✅ 전체 선수 명단에서 ID에 맞는 선수 찾기
    const player = PLAYERS.find(p => p.id === id) || { name: '알 수 없는 선수', position: '??', status: '정상' };

    const handleAddMemo = () => {
        if (!memo.trim()) return;
        const newMemo = {
            id: Date.now(),
            content: memo,
            date: new Date().toLocaleDateString('ko-KR').slice(0, -1)
        };
        setMemos([newMemo, ...memos]);
        setMemo('');
    };

    return (
        <main className="min-h-screen bg-gray-50 pb-20 font-pretendard">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg px-5 pt-6 pb-4 flex items-center justify-between border-b border-gray-100">
                <button onClick={() => router.back()} className="p-1 -ml-1 text-gray-400">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-lg font-bold text-gray-900">선수 상세 프로필</h1>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                    <MessageSquare size={18} />
                </div>
            </header>

            {/* 1. Profile Banner */}
            <section className="bg-white px-6 pt-10 pb-8 rounded-b-[40px] shadow-sm mb-4">
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-[40px] bg-blue-50 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-white flex items-center justify-center text-blue-300">
                                <UserPlus size={48} />
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-xion-red text-white flex items-center justify-center rounded-2xl font-black italic shadow-lg">
                            {id.slice(-2)}
                        </div>
                    </div>
                    <div className="text-center mt-6">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">{player.name}</h2>
                        <p className="text-sm font-bold text-gray-400 mt-1">에이스 아카데미 • {player.position}</p>
                    </div>
                    <div className="flex space-x-3 mt-6">
                        <div className="bg-green-50 px-4 py-2 rounded-2xl">
                            <span className="text-[10px] font-bold text-green-600 block uppercase">Condition</span>
                            <span className="text-sm font-black text-green-700">정보 없음</span>
                        </div>
                        <div className="bg-gray-50 px-4 py-2 rounded-2xl">
                            <span className="text-[10px] font-bold text-gray-400 block uppercase">Attendance</span>
                            <span className="text-sm font-black text-gray-800">-</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Coach Memo Section (Moved here based on user feedback) */}
            <section className="px-5 mb-6">
                <div className="bg-gray-900 rounded-[32px] p-6 shadow-xl border border-gray-800">
                    <div className="flex items-center space-x-2 mb-6 text-white">
                        <StickyNote size={18} className="text-yellow-400" />
                        <h3 className="text-sm font-black uppercase tracking-widest">Coach Private Notes</h3>
                    </div>

                    {/* Input Overlay Styles */}
                    <div className="relative mb-6">
                        <textarea
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            placeholder="선수에 대한 코치님만의 비공개 소견을 입력하세요..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 text-sm text-white placeholder:text-gray-500 min-h-[100px] focus:ring-1 focus:ring-xion-red transition-all outline-none"
                        />
                        <button
                            onClick={handleAddMemo}
                            className="absolute bottom-4 right-4 text-xion-red p-1 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                        >
                            <Send size={20} />
                        </button>
                    </div>

                    {/* Recent Memos List */}
                    <div className="space-y-3 max-h-[200px] overflow-y-auto no-scrollbar">
                        {memos.map((m) => (
                            <div key={m.id} className="bg-white/5 p-4 rounded-2xl border-l-4 border-xion-red">
                                <p className="text-xs text-white/80 leading-relaxed font-medium">{m.content}</p>
                                <span className="text-[10px] text-gray-500 font-bold mt-2 block tracking-tight">{m.date} • Created by Coach</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Physical Data (Radar) */}
            <section className="px-5 mb-6">
                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-white">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                            <TrendingUp size={18} className="text-xion-red" />
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Physical Index</h3>
                        </div>
                        <span className="text-[10px] font-bold text-gray-300">Updated: 2h ago</span>
                    </div>
                    <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={physicalData}>
                                <PolarGrid stroke="#f1f5f9" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                <Radar
                                    name="Player"
                                    dataKey="A"
                                    stroke="#E11D48"
                                    fill="#E11D48"
                                    fillOpacity={0.15}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>

            {/* 4. Weekly Workload (Line/Area) */}
            <section className="px-5 mb-10">
                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-white">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                            <Activity size={18} className="text-blue-500" />
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Weekly Workload</h3>
                        </div>
                        <span className="text-xs font-black text-gray-900 italic">435.5 km</span>
                    </div>
                    <div className="w-full h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={workloadData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                <Tooltip />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>
        </main>
    );
}
