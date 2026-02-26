"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Users, HeartHandshake } from 'lucide-react';
import Image from 'next/image';

export default function EntrancePage() {
  const router = useRouter();

  const handleModeSelection = (mode: string) => {
    if (mode === 'parent') return; // 학부모 모드는 준비 중
    router.push(`/${mode}`);
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 pb-12">
      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 flex flex-col items-center"
      >
        <div className="w-48 h-20 relative">
          {/* Logo Placeholder - 사용자에게 로고 파일 배치를 안내함 */}
          <div className="text-4xl font-black text-xion-red tracking-tighter italic">XION</div>
          <div className="text-xs text-gray-400 mt-2 font-medium tracking-widest text-center">SOCCER ACADEMY</div>
        </div>
      </motion.div>

      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold text-center mb-8">모드를 선택하여 시작하세요</h1>

        {/* Coach Mode */}
        <ModeButton
          icon={<User className="w-6 h-6" />}
          title="코치 모드 (COACH)"
          description="선수단 관리 및 성적 분석"
          onClick={() => handleModeSelection('coach')}
          active
        />

        {/* Player Mode */}
        <ModeButton
          icon={<Users className="w-6 h-6" />}
          title="선수 모드 (PLAYER)"
          description="내 성적 확인 및 코치 피드백"
          onClick={() => handleModeSelection('player')}
          active
        />

        {/* Parent Mode (Disabled) */}
        <ModeButton
          icon={<HeartHandshake className="w-6 h-6" />}
          title="학부모 모드 (PARENT)"
          description="출결 및 결제 알림 (준비 중)"
          disabled
        />
      </div>

      <p className="mt-12 text-xs text-gray-400">© 2026 XION Soccer Academy. All rights reserved.</p>
    </main>
  );
}

function ModeButton({ icon, title, description, onClick, active, disabled }: {
  icon: React.ReactNode,
  title: string,
  description: string,
  onClick?: () => void,
  active?: boolean,
  disabled?: boolean
}) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      disabled={disabled}
      onClick={onClick}
      className={`w-full flex items-center p-5 rounded-2xl border-2 transition-all text-left
        ${disabled ? 'bg-gray-50 border-gray-100 opacity-60 grayscale cursor-not-allowed' :
          active ? 'bg-white border-gray-100 hover:border-xion-red shadow-sm' : 'bg-white border-transparent shadow-none'}
      `}
    >
      <div className={`p-3 rounded-xl mr-4 ${disabled ? 'bg-gray-200 text-gray-500' : 'bg-xion-red/5 text-xion-red'}`}>
        {icon}
      </div>
      <div>
        <div className="font-bold text-gray-900">{title}</div>
        <div className="text-sm text-gray-500">{description}</div>
      </div>
    </motion.button>
  );
}
