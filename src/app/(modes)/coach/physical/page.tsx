"use client";

import React, { useState } from 'react';
import {
    ResponsiveContainer,
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis
} from 'recharts';
import { ArrowLeft, ChevronRight, Activity, Zap, Shield, Target, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PLAYERS, Player } from '@/constants/players';

export default function PhysicalPage() {
    const router = useRouter();
    // 첫 번째 선수로 초기화하되 데이터는 중립 상태로 설정 (빈 배열 시 undefined 허용)
    const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>(PLAYERS[0]);

    // 실제 데이터 연동 전까지 중립적인 차트 데이터 제공
    const chartData = [
        { subject: 'Speed', A: 50, fullMark: 100 },
        { subject: 'Stamina', A: 50, fullMark: 100 },
        { subject: 'Technique', A: 50, fullMark: 100 },
        { subject: 'Strength', A: 50, fullMark: 100 },
        { subject: 'Passing', A: 50, fullMark: 100 },
        { subject: 'Aggression', A: 50, fullMark: 100 },
    ];

    return (
        <main className="min-h-screen bg-white p-6 pb-24 max-w-lg mx-auto overflow-x-hidden font-pretendard">
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-400">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-lg font-black tracking-tight text-gray-900 italic uppercase">Physical Analysis</h2>
                <div className="w-10"></div>
            </header>

            {/* Player Selector Scroll */}
            <div className="flex space-x-3 overflow-x-auto no-scrollbar mb-8 -mx-1 px-1">
                {PLAYERS.length === 0 ? (
                    <div className="flex-1 text-center py-2 bg-gray-50 rounded-2xl text-xs font-bold text-gray-400">
                        등록된 선수가 없습니다.
                    </div>
                ) : (
                    PLAYERS.map((player) => (
                        <button
                            key={player.id}
                            onClick={() => setSelectedPlayer(player)}
                            className={`flex-shrink-0 px-4 py-2 rounded-2xl border-2 transition-all font-bold text-sm
                  ${selectedPlayer?.id === player.id ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-100 bg-white text-gray-400'}
                `}
                        >
                            {player.name}
                        </button>
                    ))
                )}
            </div>

            {/* Radar Chart Section */}
            <section className="bg-gray-50 rounded-[40px] p-8 mb-8 flex flex-col items-center">
                <div className="w-full aspect-square max-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                            <PolarGrid stroke="#E5E7EB" />
                            <PolarAngleAxis
                                dataKey="subject"
                                tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 700 }}
                            />
                            {selectedPlayer && (
                                <Radar
                                    name={selectedPlayer.name}
                                    dataKey="A"
                                    stroke="#E11D48"
                                    fill="#E11D48"
                                    fillOpacity={0.1}
                                    strokeWidth={2}
                                />
                            )}
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
                <div className="text-center mt-4">
                    <h3 className="text-xl font-black text-gray-900">{selectedPlayer?.name || '선수 없음'}</h3>
                    <p className="text-sm font-bold text-gray-400">{selectedPlayer?.position || '-'} • No Data</p>
                </div>
            </section>

            {/* Stats Breakdown */}
            <div className="grid grid-cols-2 gap-4">
                <StatRow icon={<Zap size={16} />} label="Speed" value={0} color="text-yellow-500" />
                <StatRow icon={<Activity size={16} />} label="Stamina" value={0} color="text-blue-500" />
                <StatRow icon={<Target size={16} />} label="Technique" value={0} color="text-purple-500" />
                <StatRow icon={<Shield size={16} />} label="Strength" value={0} color="text-red-500" />
            </div>
            <p className="text-center text-[10px] font-bold text-gray-300 mt-10">선수별 상세 피지컬 데이터가 아직 입력되지 않았습니다.</p>
        </main>
    );
}

function StatRow({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: string }) {
    return (
        <div className="bg-white border border-gray-100 p-4 rounded-3xl flex items-center justify-between opacity-40">
            <div className="flex items-center space-x-2">
                <div className={`p-1.5 rounded-lg bg-gray-50 ${color}`}>
                    {icon}
                </div>
                <span className="text-xs font-bold text-gray-500">{label}</span>
            </div>
            <span className="text-sm font-black text-gray-900">{value}</span>
        </div>
    );
}
