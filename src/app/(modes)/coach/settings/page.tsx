"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Camera, Save, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeamSettingsPage() {
    const router = useRouter();
    const [teamName, setTeamName] = useState('에이스 아카데미');
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <main className="min-h-screen bg-white pb-10 font-pretendard">
            {/* Header */}
            <header className="px-5 pt-6 pb-4 flex items-center justify-between border-b border-gray-50">
                <div className="flex items-center space-x-2">
                    <button onClick={() => router.back()} className="p-1 -ml-1 text-gray-400">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-xl font-black text-gray-900 tracking-tight">팀 설정</h1>
                </div>
            </header>

            <div className="px-6 py-8 space-y-10">
                {/* Team Logo Section */}
                <section className="flex flex-col items-center">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-[40px] bg-gray-50 flex items-center justify-center border-4 border-white shadow-xl shadow-gray-200/50 overflow-hidden">
                            <span className="text-5xl font-black text-xion-red italic">XI</span>
                        </div>
                        <button className="absolute bottom-1 right-1 w-10 h-10 bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                            <Camera size={18} />
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 font-bold mt-4">팀 로고 변경</p>
                </section>

                {/* Form Section */}
                <section className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Team Name</label>
                        <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-base font-bold text-gray-900 focus:ring-2 focus:ring-xion-red/20 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Location</label>
                        <div className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-sm font-bold text-gray-400">
                            서울시 강남구 (준비 중)
                        </div>
                    </div>
                </section>

                {/* Save Button */}
                <section className="pt-4">
                    <button
                        onClick={handleSave}
                        className="w-full bg-xion-red text-white py-4 rounded-3xl font-black text-lg shadow-xl shadow-xion-red/20 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
                    >
                        <Save size={20} />
                        <span>설정 저장하기</span>
                    </button>
                </section>
            </div>

            {/* Success Feedback */}
            <AnimatePresence>
                {isSaved && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="fixed bottom-10 left-6 right-6 z-50 bg-gray-900 text-white p-4 rounded-3xl flex items-center space-x-3 shadow-2xl"
                    >
                        <CheckCircle2 size={20} className="text-green-400" />
                        <span className="text-sm font-bold">팀 정보가 성공적으로 변경되었습니다.</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
