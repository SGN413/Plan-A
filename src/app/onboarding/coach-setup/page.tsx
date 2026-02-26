"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Building2, Hash, CheckCircle2, ArrowRight } from 'lucide-react';

// Mock 팀 데이터: 코드 → 팀 정보
const TEAMS: Record<string, { name: string; members: number }> = {
    'AAAAAA': { name: '풋볼 A', members: 14 },
};

type Mode = 'choose' | 'new-team' | 'existing-code' | 'success';

export default function CoachSetupPage() {
    const router = useRouter();
    const [mode, setMode] = useState<Mode>('choose');
    const [code, setCode] = useState('');
    const [codeError, setCodeError] = useState('');
    const [foundTeam, setFoundTeam] = useState<{ name: string; members: number } | null>(null);
    const [newTeamName, setNewTeamName] = useState('');

    const handleCodeSubmit = () => {
        const upperCode = code.toUpperCase().trim();
        if (TEAMS[upperCode]) {
            setFoundTeam(TEAMS[upperCode]);
            setCodeError('');
            // 기존 팀 코드 저장
            localStorage.setItem('plana_user_team', TEAMS[upperCode].name);
            localStorage.setItem('plana_user_team_code', upperCode);
            setMode('success');
        } else {
            setCodeError('팀 코드를 찾을 수 없습니다. 다시 확인해주세요.');
        }
    };

    const handleNewTeam = () => {
        if (!newTeamName.trim()) return;
        localStorage.setItem('plana_user_team', newTeamName.trim());
        localStorage.setItem('plana_user_team_code', 'NEW');
        setMode('success');
        setFoundTeam({ name: newTeamName.trim(), members: 0 });
    };

    const goToDashboard = () => {
        router.push('/coach');
    };

    return (
        <main className="min-h-screen bg-white flex flex-col font-pretendard">
            {/* Header */}
            <header className="px-6 pt-10 pb-4 flex items-center space-x-3">
                <button onClick={() => mode === 'choose' ? router.back() : setMode('choose')} className="p-1 text-gray-400">
                    <ChevronLeft size={24} />
                </button>
                <img src="/plana_logo.png" alt="PlanA" className="w-16 h-auto" />
            </header>

            <div className="flex-1 flex flex-col justify-center px-8 pb-24">
                <AnimatePresence mode="wait">

                    {/* 선택 화면 */}
                    {mode === 'choose' && (
                        <motion.div key="choose" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <h1 className="text-2xl font-black text-gray-900 leading-tight mb-2">
                                팀을 어떻게<br />연결할까요?
                            </h1>
                            <p className="text-sm text-gray-400 font-medium mb-10">이미 팀이 있으시면 코드로 연결하세요.</p>
                            <div className="space-y-4">
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setMode('new-team')}
                                    className="w-full flex items-center space-x-5 p-6 rounded-[24px] border-2 border-gray-100 bg-white hover:border-gray-900 hover:shadow-lg group transition-all"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-900 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-colors">
                                        <Building2 size={22} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-black text-gray-900 text-base">새로운 팀 등록하기</p>
                                        <p className="text-xs text-gray-400 mt-0.5">팀을 새로 만들고 선수를 초대하세요</p>
                                    </div>
                                </motion.button>

                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setMode('existing-code')}
                                    className="w-full flex items-center space-x-5 p-6 rounded-[24px] border-2 border-gray-900 bg-gray-900 text-white group transition-all"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                        <Hash size={22} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-black text-base">기존 팀이 있어요</p>
                                        <p className="text-xs text-white/60 mt-0.5">팀 코드(6자리)로 즉시 연결</p>
                                    </div>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* 새로운 팀 등록 */}
                    {mode === 'new-team' && (
                        <motion.div key="new-team" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <h1 className="text-2xl font-black text-gray-900 leading-tight mb-2">새 팀 이름을<br />알려주세요!</h1>
                            <p className="text-sm text-gray-400 font-medium mb-10">나중에 변경할 수 있습니다.</p>
                            <input
                                type="text"
                                value={newTeamName}
                                onChange={(e) => setNewTeamName(e.target.value)}
                                placeholder="예: 풋볼 A"
                                autoFocus
                                className="w-full text-xl font-bold text-gray-900 border-b-2 border-gray-900 py-3 outline-none bg-transparent placeholder-gray-300"
                            />
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={handleNewTeam}
                                disabled={!newTeamName.trim()}
                                className="w-full bg-gray-900 text-white py-4 rounded-[24px] font-black text-base flex items-center justify-center space-x-2 disabled:opacity-30 transition-all mt-8"
                            >
                                <span>팀 만들기</span>
                                <ArrowRight size={18} />
                            </motion.button>
                        </motion.div>
                    )}

                    {/* 팀 코드 입력 */}
                    {mode === 'existing-code' && (
                        <motion.div key="existing-code" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <h1 className="text-2xl font-black text-gray-900 leading-tight mb-2">팀 코드를<br />입력해주세요</h1>
                            <p className="text-sm text-gray-400 font-medium mb-10">코치님께 받은 6자리 알파벳 코드를 입력하세요.</p>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => { setCode(e.target.value.toUpperCase()); setCodeError(''); }}
                                placeholder="AAAAAA"
                                maxLength={6}
                                autoFocus
                                className="w-full text-3xl font-black text-gray-900 tracking-[0.4em] border-b-2 border-gray-900 py-3 outline-none bg-transparent placeholder-gray-300 uppercase text-center"
                            />
                            {codeError && (
                                <p className="text-sm text-red-500 font-bold mt-3 text-center">{codeError}</p>
                            )}
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={handleCodeSubmit}
                                disabled={code.length < 6}
                                className="w-full bg-gray-900 text-white py-4 rounded-[24px] font-black text-base flex items-center justify-center space-x-2 disabled:opacity-30 transition-all mt-8"
                            >
                                <span>팀 연결하기</span>
                                <ArrowRight size={18} />
                            </motion.button>
                        </motion.div>
                    )}

                    {/* 성공 화면 */}
                    {mode === 'success' && foundTeam && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <div className="w-20 h-20 bg-green-50 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={40} className="text-green-500" />
                            </div>
                            <h1 className="text-2xl font-black text-gray-900 mb-2">{foundTeam.name}</h1>
                            <p className="text-sm text-gray-400 font-medium mb-10">팀 연결이 완료되었습니다!</p>
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={goToDashboard}
                                className="w-full bg-gray-900 text-white py-4 rounded-[24px] font-black text-base flex items-center justify-center space-x-2"
                            >
                                <span>코치 대시보드로 이동</span>
                                <ArrowRight size={18} />
                            </motion.button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </main>
    );
}
