"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Search, Users, CheckCircle2, ArrowRight } from 'lucide-react';

// Mock 팀 목록 데이터
const ALL_TEAMS = [
    { code: 'AAAAAA', name: '풋볼 A', coach: '홍길동 코치', members: 14, location: '서울' },
];

type Mode = 'search' | 'apply' | 'success';

export default function PlayerSetupPage() {
    const router = useRouter();
    const [mode, setMode] = useState<Mode>('search');
    const [query, setQuery] = useState('');
    const [selectedTeam, setSelectedTeam] = useState<typeof ALL_TEAMS[0] | null>(null);

    const filtered = query.trim()
        ? ALL_TEAMS.filter((t) =>
            t.name.toLowerCase().includes(query.toLowerCase()) ||
            t.code.toLowerCase().includes(query.toLowerCase())
        )
        : ALL_TEAMS;

    const handleSelectTeam = (team: typeof ALL_TEAMS[0]) => {
        setSelectedTeam(team);
        setMode('apply');
    };

    const handleApply = () => {
        if (!selectedTeam) return;
        localStorage.setItem('plana_user_team', selectedTeam.name);
        localStorage.setItem('plana_user_team_code', selectedTeam.code);
        setMode('success');
    };

    return (
        <main className="min-h-screen bg-white flex flex-col font-pretendard">
            {/* Header */}
            <header className="px-6 pt-10 pb-4 flex items-center space-x-3">
                <button onClick={() => mode === 'search' ? router.back() : setMode('search')} className="p-1 text-gray-400">
                    <ChevronLeft size={24} />
                </button>
                <img src="/plana_logo.png" alt="PlanA" className="w-16 h-auto" />
            </header>

            <div className="flex-1 flex flex-col px-6 pb-24">
                <AnimatePresence mode="wait">

                    {/* 팀 검색 화면 */}
                    {mode === 'search' && (
                        <motion.div key="search" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col">
                            <div className="mb-8">
                                <h1 className="text-2xl font-black text-gray-900 leading-tight mb-1">어떤 팀에<br />소속되어 있나요?</h1>
                                <p className="text-sm text-gray-400 font-medium">팀 이름이나 코드로 검색하세요.</p>
                            </div>

                            {/* 검색창 */}
                            <div className="relative mb-6">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="팀 이름 검색..."
                                    autoFocus
                                    className="w-full pl-11 pr-4 py-4 rounded-[20px] bg-gray-50 border border-gray-100 text-sm font-bold text-gray-900 placeholder-gray-300 outline-none focus:border-gray-900 transition-colors"
                                />
                            </div>

                            {/* 검색 결과 */}
                            <div className="space-y-3">
                                {filtered.length === 0 ? (
                                    <p className="text-center text-sm font-medium text-gray-400 py-10">검색 결과가 없습니다.</p>
                                ) : (
                                    filtered.map((team) => (
                                        <motion.button
                                            key={team.code}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleSelectTeam(team)}
                                            className="w-full flex items-center space-x-4 p-5 rounded-[24px] border-2 border-gray-100 bg-white hover:border-gray-900 hover:shadow-md group transition-all text-left"
                                        >
                                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white text-gray-700 transition-colors">
                                                <Users size={22} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-black text-gray-900 text-base">{team.name}</p>
                                                <p className="text-xs text-gray-400 font-medium mt-0.5">{team.location} • 선수 {team.members}명 • {team.coach}</p>
                                            </div>
                                            <span className="text-[10px] font-black tracking-widest text-gray-300">{team.code}</span>
                                        </motion.button>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* 가입 신청 확인 */}
                    {mode === 'apply' && selectedTeam && (
                        <motion.div key="apply" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col justify-center flex-1">
                            <h1 className="text-2xl font-black text-gray-900 leading-tight mb-2">이 팀에<br />가입 신청할까요?</h1>
                            <p className="text-sm text-gray-400 font-medium mb-8">코치님의 승인 후 팀에 합류됩니다.</p>

                            {/* 팀 카드 */}
                            <div className="bg-gray-50 rounded-[24px] p-6 mb-8 border border-gray-100">
                                <div className="flex items-center space-x-4">
                                    <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white">
                                        <Users size={26} />
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900 text-xl">{selectedTeam.name}</p>
                                        <p className="text-xs text-gray-400 font-medium mt-1">{selectedTeam.location} • 선수 {selectedTeam.members}명</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleApply}
                                    className="w-full bg-gray-900 text-white py-4 rounded-[24px] font-black text-base flex items-center justify-center space-x-2"
                                >
                                    <span>가입 신청하기</span>
                                    <ArrowRight size={18} />
                                </motion.button>
                                <button onClick={() => setMode('search')} className="w-full py-3 text-sm font-bold text-gray-400">
                                    다른 팀 검색하기
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* 신청 완료 */}
                    {mode === 'success' && selectedTeam && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex-1 flex flex-col items-center justify-center text-center"
                        >
                            <div className="w-20 h-20 bg-green-50 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={40} className="text-green-500" />
                            </div>
                            <h1 className="text-2xl font-black text-gray-900 mb-2">가입 신청 완료!</h1>
                            <p className="text-sm text-gray-400 font-medium mb-2">{selectedTeam.name}</p>
                            <p className="text-xs text-gray-300 font-medium mb-10">코치님의 승인을 기다려주세요.</p>
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={() => router.push('/player')}
                                className="w-full bg-gray-900 text-white py-4 rounded-[24px] font-black text-base flex items-center justify-center space-x-2"
                            >
                                <span>선수 대시보드로 이동</span>
                                <ArrowRight size={18} />
                            </motion.button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </main>
    );
}
