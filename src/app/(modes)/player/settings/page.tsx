"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Camera, Bell, Shield, LogOut, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PlayerSettingsPage() {
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const name = localStorage.getItem('plana_user_name');
        if (name) setUserName(name);
    }, []);

    const handleLogout = () => {
        if (confirm('로그아웃 하시겠습니까?')) {
            localStorage.removeItem('plana_user_name');
            localStorage.removeItem('plana_user_phone');
            localStorage.removeItem('plana_user_birth');
            localStorage.removeItem('plana_user_team');
            localStorage.removeItem('plana_user_role');
            window.location.href = '/';
        }
    };

    const handleSave = () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <main className="min-h-screen bg-white pb-32 font-pretendard">
            {/* Header */}
            <header className="px-5 pt-6 pb-4 flex items-center justify-between border-b border-gray-50">
                <div className="flex items-center space-x-2">
                    <button onClick={() => router.back()} className="p-1 -ml-1 text-gray-400">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-xl font-black text-gray-900 tracking-tight">마이페이지</h1>
                </div>
            </header>

            <div className="px-6 py-8 space-y-8">
                {/* Profile Section */}
                <section className="flex flex-col items-center">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-[36px] bg-gray-900 flex items-center justify-center border-4 border-white shadow-xl shadow-gray-200 overflow-hidden">
                            <span className="text-4xl font-black text-white italic">{userName?.slice(0, 1) || 'P'}</span>
                        </div>
                        <button className="absolute bottom-0 right-0 w-9 h-9 bg-xion-red text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                            <Camera size={16} />
                        </button>
                    </div>
                    <div className="text-center mt-4">
                        <h2 className="text-xl font-black text-gray-900">{userName} 선수</h2>
                        <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">No. 10 • FW</p>
                    </div>
                </section>

                {/* Settings Menu */}
                <section className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 ml-1">Account</label>
                    <div className="bg-gray-50 rounded-[32px] p-2">
                        <MenuButton icon={Bell} title="알림 설정" desc="푸시 알림 및 소리 설정" />
                        <div className="h-px bg-gray-100 mx-4 my-1" />
                        <MenuButton icon={Shield} title="보안 및 개인정보" desc="비밀번호 및 권한 관리" />
                    </div>
                </section>

                {/* Action Button */}
                <section className="pt-2">
                    <button
                        onClick={handleSave}
                        className="w-full bg-gray-900 text-white py-4 rounded-3xl font-black text-base shadow-xl shadow-gray-200 active:scale-[0.98] transition-all"
                    >
                        변경사항 저장
                    </button>
                </section>

                {/* Logout Section */}
                <section className="pt-8 border-t border-gray-50 text-center">
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center space-x-2 w-full py-4 text-gray-300 font-bold hover:text-red-500 transition-colors"
                    >
                        <LogOut size={18} />
                        <span className="text-sm">로그아웃 하기</span>
                    </button>
                    <p className="text-[10px] text-gray-200 font-medium mt-4">
                        PlanA Player v0.1.0 • Stable
                    </p>
                </section>
            </div>

            {/* Success Feedback */}
            <AnimatePresence>
                {isSaved && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="fixed bottom-32 left-6 right-6 z-50 bg-gray-900 text-white p-4 rounded-2xl text-center shadow-2xl"
                    >
                        <span className="text-sm font-bold">성공적으로 저장되었습니다.</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

function MenuButton({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <button className="w-full flex items-center justify-between p-4 hover:bg-white rounded-2xl transition-all group">
            <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-gray-900 shadow-sm">
                    <Icon size={20} />
                </div>
                <div className="text-left">
                    <p className="text-sm font-bold text-gray-900">{title}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{desc}</p>
                </div>
            </div>
            <ChevronLeft size={16} className="text-gray-300 rotate-180" />
        </button>
    );
}
