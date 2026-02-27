"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn } from 'lucide-react';

export default function EntrancePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // 로그인 폼 상태
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);

  useEffect(() => {
    // 앱 로드 시 로컬 스토리지에 유저가 있으면 자동 로그인, 없으면 로그인 폼 노출
    const timer = setTimeout(() => {
      const savedRole = localStorage.getItem('plana_user_role');
      const savedName = localStorage.getItem('plana_user_name');
      const savedAutoLogin = localStorage.getItem('plana_auto_login');

      if (savedRole && savedName && savedAutoLogin === 'true') {
        if (savedRole === 'coach') {
          router.replace('/coach');
        } else if (savedRole === 'player') {
          router.replace('/player');
        } else {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

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
              <header className="text-center mb-8 w-full mt-10">
                <div className="mb-4 flex justify-center">
                  <img
                    src="/plana_logo.png"
                    alt="PlanA"
                    className="w-40 h-auto opacity-90"
                  />
                </div>
              </header>

              <div className="w-full">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1 text-left">
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

                  <div className="space-y-1 text-left">
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

                  <label className="flex items-center space-x-2 cursor-pointer mt-2 pl-1 mb-4 text-left">
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
                      className="text-xs text-red-500 font-bold px-1 text-left mb-2"
                    >
                      {error}
                    </motion.p>
                  )}

                  <div className="pt-4 space-y-3">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      disabled={!name.trim() || !phone.trim()}
                      className="w-full bg-gray-900 text-white py-4 rounded-[24px] font-black text-base flex items-center justify-center space-x-2 disabled:opacity-30 transition-all"
                    >
                      <span>로그인</span>
                      <LogIn size={18} />
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={(e) => { e.preventDefault(); router.push('/onboarding'); }}
                      className="w-full bg-white text-gray-900 border-2 border-gray-900 py-4 rounded-[24px] font-black text-base hover:bg-gray-50 transition-all flex items-center justify-center"
                    >
                      새로 시작하기 (회원가입)
                    </motion.button>
                  </div>
                </form>
              </div>

              <footer className="text-center mt-12 pb-6">
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


