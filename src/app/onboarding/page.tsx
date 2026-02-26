"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Users, User, UsersRound } from 'lucide-react';

// 타이핑 애니메이션 훅
function useTypewriter(text: string, speed = 40, start = true) {
    const [displayed, setDisplayed] = useState('');
    const [done, setDone] = useState(false);
    useEffect(() => {
        if (!start) return;
        setDisplayed('');
        setDone(false);
        let i = 0;
        const interval = setInterval(() => {
            setDisplayed(text.slice(0, i + 1));
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                setDone(true);
            }
        }, speed);
        return () => clearInterval(interval);
    }, [text, speed, start]);
    return { displayed, done };
}

type Step = 'name' | 'phone' | 'role';

const ROLES = [
    { id: 'coach', label: '감독/코치', icon: Users, desc: '선수단 관리 및 데이터 분석' },
    { id: 'player', label: '선수', icon: User, desc: '컨디션 체크 및 성장 리포트' },
    { id: 'parent', label: '부모님', icon: UsersRound, desc: '출결 및 알림 (준비 중)', disabled: true },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('name');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const nameQuestion = `안녕하세요! 👋\n이름을 알려주세요.`;
    const phoneQuestion = `반갑습니다, ${name}님!\n전화번호를 알려주세요.`;
    const roleQuestion = `어떤 역할로 사용하시나요?`;

    const currentQuestion =
        step === 'name' ? nameQuestion :
            step === 'phone' ? phoneQuestion :
                roleQuestion;

    const { displayed, done } = useTypewriter(currentQuestion, 35, true);

    useEffect(() => {
        if (done && inputRef.current && step !== 'role') {
            inputRef.current.focus();
        }
    }, [done, step]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        if (step === 'name') {
            setName(inputValue.trim());
            setInputValue('');
            setTimeout(() => setStep('phone'), 300);
        } else if (step === 'phone') {
            setPhone(inputValue.trim());
            setInputValue('');
            setTimeout(() => setStep('role'), 300);
        }
    };

    const handleRoleSelect = (roleId: string) => {
        if (roleId === 'parent') return;
        // localStorage에 저장
        localStorage.setItem('plana_user_name', name);
        localStorage.setItem('plana_user_phone', phone);
        localStorage.setItem('plana_user_role', roleId);
        if (roleId === 'coach') {
            router.push('/onboarding/coach-setup');
        } else if (roleId === 'player') {
            router.push('/onboarding/player-setup');
        }
    };

    return (
        <main className="min-h-screen bg-white flex flex-col font-pretendard">
            {/* 로고 */}
            <div className="px-6 pt-10">
                <img src="/plana_logo.png" alt="PlanA" className="w-20 h-auto" />
            </div>

            <div className="flex-1 flex flex-col justify-center px-8 pb-24">
                {/* 질문 타이핑 */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="mb-10"
                    >
                        <p className="text-2xl font-black text-gray-900 leading-relaxed whitespace-pre-line min-h-[4rem]">
                            {displayed}
                            {!done && <span className="animate-pulse text-gray-400">|</span>}
                        </p>
                    </motion.div>
                </AnimatePresence>

                {/* 입력 영역 */}
                <AnimatePresence>
                    {step !== 'role' && done && (
                        <motion.form
                            key="input-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <input
                                ref={inputRef}
                                type={step === 'phone' ? 'tel' : 'text'}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={step === 'name' ? '이름을 입력해주세요' : '010-0000-0000'}
                                className="w-full text-xl font-bold text-gray-900 border-b-2 border-gray-900 py-3 outline-none bg-transparent placeholder-gray-300 focus:border-gray-900 transition-colors"
                            />
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                type="submit"
                                disabled={!inputValue.trim()}
                                className="w-full bg-gray-900 text-white py-4 rounded-[24px] font-black text-base flex items-center justify-center space-x-2 disabled:opacity-30 transition-all mt-6"
                            >
                                <span>다음으로</span>
                                <ArrowRight size={18} />
                            </motion.button>
                        </motion.form>
                    )}

                    {/* 역할 선택 */}
                    {step === 'role' && done && (
                        <motion.div
                            key="role-select"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-3"
                        >
                            {ROLES.map((role) => (
                                <motion.button
                                    key={role.id}
                                    whileHover={!role.disabled ? { scale: 1.02, x: 4 } : {}}
                                    whileTap={!role.disabled ? { scale: 0.98 } : {}}
                                    onClick={() => handleRoleSelect(role.id)}
                                    disabled={role.disabled}
                                    className={`w-full flex items-center space-x-5 p-5 rounded-[24px] border-2 text-left transition-all ${role.disabled
                                        ? 'border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed'
                                        : 'border-gray-100 bg-white hover:border-gray-900 hover:shadow-lg group cursor-pointer'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${role.disabled ? 'bg-gray-100 text-gray-400' : 'bg-gray-50 text-gray-900 group-hover:bg-gray-900 group-hover:text-white'
                                        }`}>
                                        <role.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900 text-base">{role.label}</p>
                                        <p className="text-xs text-gray-400 font-medium mt-0.5">{role.desc}</p>
                                    </div>
                                </motion.button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
