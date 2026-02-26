"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, UsersRound, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EntrancePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      const savedRole = localStorage.getItem('plana_user_role');
      const savedName = localStorage.getItem('plana_user_name');

      if (savedRole && savedName) {
        if (savedRole === 'coach') {
          router.replace('/coach');
        } else if (savedRole === 'player') {
          router.replace('/player');
        } else {
          router.replace('/onboarding');
        }
      }
    }, 1800);
    return () => clearTimeout(timer);
  }, [router]);

  const handleModeSelection = (mode: string) => {
    if (mode === 'parent') return;
    router.push(`/${mode}`);
  };

  return (
    <main className="relative min-h-screen bg-white overflow-hidden font-pretendard">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src="/plana_logo.png"
                alt="PlanA Logo"
                className="w-48 h-auto object-contain"
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gray-400/10 blur-3xl rounded-full"
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center justify-center min-h-screen px-6 py-12 relative"
          >
            {/* 상단 앱 설치 버튼 */}
            <div className="absolute top-10 right-6 z-30">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-2xl shadow-lg shadow-gray-200"
                onClick={() => alert('브라우저 메뉴에서 "홈 화면에 추가"를 선택하여 PLAN A 앱을 설치하실 수 있습니다.')}
              >
                <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                  <img src="/plana_logo.png" alt="PLAN A" className="w-4 h-4" />
                </div>
                <span className="text-xs font-black">앱 다운로드</span>
              </motion.button>
            </div>

            <div className="w-full max-w-sm flex flex-col items-center h-full">
              <header className="text-center mb-12 w-full">
                <div className="mb-6 flex justify-center">
                  <img
                    src="/plana_logo.png"
                    alt="PlanA"
                    className="w-32 h-auto opacity-80"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">반갑습니다.</h1>
                  <p className="text-sm text-gray-400 font-medium mt-1">관리하시는 계정 유형을 선택해주세요.</p>
                </div>
              </header>

              <div className="w-full space-y-4">
                <ModeCard
                  id="coach"
                  icon={Users}
                  title="코치 모드"
                  desc="선수단 및 데이터 관리"
                  onClick={() => handleModeSelection('coach')}
                />
                <ModeCard
                  id="player"
                  icon={User}
                  title="선수 모드"
                  desc="성적 확인 및 코치 피드백"
                  onClick={() => handleModeSelection('player')}
                />
                <ModeCard
                  id="parent"
                  icon={UsersRound}
                  title="학부모 모드"
                  desc="출결 및 알림 (준비 중)"
                  disabled
                  onClick={() => { }}
                />
              </div>

              <footer className="text-center mt-auto pt-10">
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest leading-loose">
                  © 2026 PlanA Soccer Academy<br />All rights reserved.
                </p>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function ModeCard({ id, icon: Icon, title, desc, onClick, disabled = false }: { id: string, icon: any, title: string, desc: string, onClick: () => void, disabled?: boolean }) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full flex items-center justify-between p-6 rounded-[32px] transition-all duration-300",
        disabled
          ? "bg-gray-50/50 border border-gray-100 opacity-60 grayscale cursor-not-allowed"
          : "bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 group"
      )}
    >
      <div className="flex items-center space-x-5">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
          disabled ? "bg-gray-200/50 text-gray-400" : "bg-gray-900/5 text-gray-900 group-hover:bg-gray-900 group-hover:text-white"
        )}>
          <Icon size={28} strokeWidth={2.5} />
        </div>
        <div className="text-left">
          <h3 className="font-bold text-gray-900 group-hover:text-gray-900 transition-colors">{title}</h3>
          <p className="text-xs text-gray-400 font-medium">{desc}</p>
        </div>
      </div>
      {!disabled && (
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-gray-900/10 group-hover:text-gray-900 transition-all">
          <ChevronRight size={18} strokeWidth={3} />
        </div>
      )}
    </motion.button>
  );
}
