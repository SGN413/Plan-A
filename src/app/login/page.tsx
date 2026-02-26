"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, LogIn } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [autoLogin, setAutoLogin] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !phone.trim()) return;

        // 임시 프로토타입용: 로컬스토리지 정보와 비교
        const savedName = localStorage.getItem('plana_user_name');
        const savedPhone = localStorage.getItem('plana_user_phone');
        const savedRole = localStorage.getItem('plana_user_role');

        if (name === savedName && phone === savedPhone && savedRole) {
            localStorage.setItem('plana_auto_login', autoLogin ? 'true' : 'false');
            router.replace(`/${savedRole}`);
        } else {
            setError('가입된 정보와 일치하지 않습니다. 회원가입을 먼저 진행해주세요.');
        }
    };

    return (
        <main className="min-h-screen bg-white flex flex-col font-pretendard">
            {/* Header */}
            <header className="px-6 pt-10 pb-4 flex items-center justify-between">
                <button onClick={() => router.back()} className="p-1 -ml-1 text-gray-400">
                    <ChevronLeft size={24} />
                </button>
            </header>

            <div className="flex-1 flex flex-col justify-center px-8 pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 flex justify-center"
                >
                    <img src="/plana_logo.png" alt="PlanA" className="w-40 h-auto" />
                </motion.div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest px-1">
                            아이디 (이름)
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setError(''); }}
                            placeholder="이름을 입력해주세요"
                            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-base font-bold text-gray-900 focus:ring-2 focus:ring-gray-900 transition-all placeholder-gray-300"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest px-1">
                            비밀번호 (전화번호)
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => { setPhone(e.target.value); setError(''); }}
                            placeholder="010-0000-0000"
                            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-base font-bold text-gray-900 focus:ring-2 focus:ring-gray-900 transition-all placeholder-gray-300 tracking-wider"
                        />
                    </div>

                    <label className="flex items-center space-x-2 cursor-pointer mt-2 pl-1">
                        <input
                            type="checkbox"
                            checked={autoLogin}
                            onChange={(e) => setAutoLogin(e.target.checked)}
                            className="w-4 h-4 rounded text-gray-900 focus:ring-gray-900 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-gray-400">자동 로그인</span>
                    </label>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-xion-red font-bold px-1"
                        >
                            {error}
                        </motion.p>
                    )}

                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={!name.trim() || !phone.trim()}
                        className="w-full bg-gray-900 text-white py-4 rounded-[24px] font-black text-base flex items-center justify-center space-x-2 disabled:opacity-30 transition-all mt-8"
                    >
                        <span>로그인</span>
                        <LogIn size={18} />
                    </motion.button>
                </form>
            </div>
        </main>
    );
}
