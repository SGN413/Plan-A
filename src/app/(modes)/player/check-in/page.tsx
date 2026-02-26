"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    Smile,
    Meh,
    Frown,
    Moon,
    Zap,
    CheckCircle2,
    ArrowRight,
    Activity // Activity 임포트 추가
} from 'lucide-react';

const steps = [
    { id: 'condition', title: '오늘 몸 상태는 어떤가요?', icon: Zap },
    { id: 'sleep', title: '어제 얼마나 주무셨나요?', icon: Moon },
    { id: 'intensity', title: '오늘 훈련 강도는 어땠나요?', icon: Activity }
];

export default function PlayerCheckInPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    // States
    const [condition, setCondition] = useState(3); // 1-5
    const [sleep, setSleep] = useState(7); // hours

    const handleNext = () => {
        if (step < 1) {
            setStep(step + 1);
        } else {
            setIsFinished(true);
            setTimeout(() => router.push('/player'), 2500);
        }
    };

    return (
        <main className="min-h-screen bg-white font-pretendard">
            <AnimatePresence mode="wait">
                {!isFinished ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="px-6 pt-8 pb-10 h-screen flex flex-col"
                    >
                        {/* Header */}
                        <header className="flex items-center justify-between mb-12">
                            <button onClick={() => router.back()} className="p-1 -ml-1 text-gray-400">
                                <ChevronLeft size={24} />
                            </button>
                            <div className="flex space-x-1.5">
                                {[0, 1].map((i) => (
                                    <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-xion-red' : 'w-2 bg-gray-100'}`}></div>
                                ))}
                            </div>
                            <div className="w-8"></div>
                        </header>

                        {/* Title */}
                        <div className="mb-12">
                            <span className="text-[10px] font-black text-xion-red uppercase tracking-[0.2em] mb-2 block">Step 0{step + 1}</span>
                            <h1 className="text-3xl font-black text-gray-900 leading-tight">
                                {step === 0 ? "오늘 몸 상태는\n어떤가요?" : "어제 잠은\n잘 주무셨나요?"}
                            </h1>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 flex flex-col justify-center">
                            {step === 0 ? (
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { v: 1, icon: Frown, label: '나쁨', color: 'text-orange-400' },
                                        { v: 3, icon: Meh, label: '보통', color: 'text-blue-400' },
                                        { v: 5, icon: Smile, label: '좋음', color: 'text-xion-red' }
                                    ].map((item) => (
                                        <button
                                            key={item.v}
                                            onClick={() => setCondition(item.v)}
                                            className={`flex flex-col items-center p-6 rounded-[32px] transition-all border-2 ${condition === item.v ? 'bg-gray-50 border-gray-900 scale-105' : 'bg-white border-gray-50 text-gray-300'}`}
                                        >
                                            <item.icon size={32} className={condition === item.v ? item.color : 'text-gray-200'} />
                                            <span className={`text-[11px] font-bold mt-3 ${condition === item.v ? 'text-gray-900' : ''}`}>{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-10">
                                    <div className="text-center">
                                        <span className="text-7xl font-black text-gray-900 italic">{sleep}</span>
                                        <span className="text-xl font-bold text-gray-400 ml-2">Hours</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="3"
                                        max="12"
                                        step="0.5"
                                        value={sleep}
                                        onChange={(e) => setSleep(parseFloat(e.target.value))}
                                        className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-xion-red"
                                    />
                                    <div className="flex justify-between px-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                        <span>Too Little</span>
                                        <span>Optimal</span>
                                        <span>More than enough</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={handleNext}
                            className="w-full bg-gray-900 text-white py-5 rounded-[24px] font-black text-lg flex items-center justify-center space-x-2 shadow-xl shadow-gray-200 active:scale-[0.98] transition-all"
                        >
                            <span>{step === 0 ? "다음으로" : "체크인 완료"}</span>
                            <ArrowRight size={20} />
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center px-10 text-center"
                    >
                        <div className="w-24 h-24 bg-green-50 rounded-[40px] flex items-center justify-center mb-8 relative">
                            <div className="absolute inset-0 bg-green-100 rounded-[40px] animate-ping opacity-20"></div>
                            <CheckCircle2 size={48} className="text-green-500 relative z-10" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">수고하셨습니다!</h2>
                        <p className="text-sm font-bold text-gray-400 mt-2 leading-relaxed">
                            오늘의 데이터가 코치님께 전달되었습니다. <br />멋진 훈련 되세요!
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
