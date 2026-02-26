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
    // 앱 로드 시 로컬 스토리지에 유저가 있으면 자동 로그인, 없으면 로그인/가입 버튼 노출
    const timer = setTimeout(() => {
      const savedRole = localStorage.getItem('plana_user_role');
      const savedName = localStorage.getItem('plana_user_name');
      const autoLogin = localStorage.getItem('plana_auto_login');

      if (savedRole && savedName && autoLogin === 'true') {
        // 이미 가입된 회원이면 대시보드로 자동 이동 (isLoading 풀지 않음)
        if (savedRole === 'coach') {
          router.replace('/coach');
        } else if (savedRole === 'player') {
          router.replace('/player');
        } else {
          setIsLoading(false);
        }
      } else {
        // 회원 정보가 없으면 로고 애니메이션 종료 후 버튼 표시
        setIsLoading(false);
      }
    }, 1500); // 로고 보여주는 최소 스플래시 시간
    return () => clearTimeout(timer);
  }, [router]);

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
                    className="w-40 h-auto opacity-90"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">반갑습니다.</h1>
                </div>
              </header>

              <div className="w-full space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/login')}
                  className="w-full bg-gray-900 text-white py-4 rounded-3xl font-black text-lg shadow-xl shadow-gray-200/50 transition-all flex items-center justify-center"
                >
                  로그인
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/onboarding')}
                  className="w-full bg-white text-gray-900 border-2 border-gray-900 py-4 rounded-3xl font-black text-lg hover:bg-gray-50 transition-all flex items-center justify-center"
                >
                  새로 시작하기 (회원가입)
                </motion.button>
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


