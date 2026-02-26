"use client";

import React from 'react';
import { ArrowLeft, Plus, Activity, AlertCircle, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Player } from '@/types';

const mockPlayers: Player[] = [
    { id: '1', name: '김민준', number: 10, position: 'FW', medicalStatus: 'normal', physicalStats: { speed: 85, stamina: 90, technique: 88, strength: 75, aggression: 80, passing: 82 } },
    { id: '2', name: '이현우', number: 7, position: 'MF', medicalStatus: 'warn', physicalStats: { speed: 80, stamina: 85, technique: 92, strength: 70, aggression: 75, passing: 90 } },
    { id: '3', name: '박지성', number: 13, position: 'MF', medicalStatus: 'rehab', physicalStats: { speed: 75, stamina: 95, technique: 80, strength: 72, aggression: 88, passing: 78 } },
];

export default function MedicalPage() {
    const router = useRouter();

    return (
        <main className="min-h-screen bg-white p-6 pb-24 max-w-lg mx-auto">
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-400">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-lg font-black tracking-tight text-gray-900 italic uppercase">Medical Status</h2>
                <button className="p-2 bg-gray-50 text-gray-400 rounded-xl">
                    <Plus size={20} />
                </button>
            </header>

            {/* Summary Chips */}
            <div className="flex space-x-2 mb-8 overflow-x-auto no-scrollbar">
                <StatusChip label="전체" count={24} active />
                <StatusChip label="정상" count={18} color="text-green-500" />
                <StatusChip label="주의" count={3} color="text-yellow-500" />
                <StatusChip label="재활" count={3} color="text-red-500" />
            </div>

            {/* Medical List */}
            <div className="space-y-4">
                {mockPlayers.map((player) => (
                    <div key={player.id} className="p-5 rounded-[32px] bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-2xl ${player.medicalStatus === 'normal' ? 'bg-green-100 text-green-600' :
                                    player.medicalStatus === 'warn' ? 'bg-yellow-100 text-yellow-600' :
                                        'bg-red-100 text-red-600'
                                }`}>
                                {player.medicalStatus === 'normal' ? <Heart size={20} /> : <AlertCircle size={20} />}
                            </div>
                            <div>
                                <div className="font-bold text-gray-900">{player.name}</div>
                                <div className="text-xs text-gray-500 font-medium">{player.position} · No.{player.number}</div>
                            </div>
                        </div>
                        <div className={`text-xs font-black uppercase px-3 py-1 rounded-full border-2 ${player.medicalStatus === 'normal' ? 'border-green-200 text-green-500' :
                                player.medicalStatus === 'warn' ? 'border-yellow-200 text-yellow-500' :
                                    'border-red-200 text-red-500'
                            }`}>
                            {player.medicalStatus}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}

function StatusChip({ label, count, active, color }: { label: string, count: number, active?: boolean, color?: string }) {
    return (
        <button className={`flex-shrink-0 px-4 py-2 rounded-2xl flex items-center space-x-2 border-2 transition-all
      ${active ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-100 bg-white text-gray-400'}
    `}>
            <span className="text-xs font-bold">{label}</span>
            <span className={`text-[10px] font-black ${active ? 'text-white/60' : color || 'text-gray-300'}`}>{count}</span>
        </button>
    );
}
