"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react';
import { useEvents, SHARED_TYPES, SharedEvent } from '@/hooks/useStore';

// 선수에게 보이는 이벤트 타입만 필터
const TYPE_CONFIG = {
    match: { label: '경기', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
    training: { label: '훈련', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
};

function toDateStr(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const DAYS_KR = ['일', '월', '화', '수', '목', '금', '토'];

function getWeekDates(date: Date): Date[] {
    const d = new Date(date);
    const day = d.getDay();
    const mon = new Date(d);
    mon.setDate(d.getDate() - ((day + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => { const x = new Date(mon); x.setDate(mon.getDate() + i); return x; });
}

export default function PlayerSchedulePage() {
    const router = useRouter();
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);
    const [selectedDate, setSelectedDate] = useState(toDateStr(today));
    const weekDates = getWeekDates(currentDate);
    const todayStr = toDateStr(today);

    const { events } = useEvents();
    // 선수에게는 훈련/경기만 공개
    const sharedEvents = events.filter(e => SHARED_TYPES.includes(e.type));
    const selectedEvents = sharedEvents.filter(e => e.date === selectedDate);

    const prevWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() - 7); setCurrentDate(d); };
    const nextWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() + 7); setCurrentDate(d); };

    return (
        <main className="min-h-screen bg-white pb-28 font-pretendard">
            <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-5 pt-6 pb-3 border-b border-gray-50">
                <div className="flex items-center justify-between mb-1">
                    <button onClick={() => router.back()} className="p-1 text-gray-400">
                        <ChevronRight size={20} className="rotate-180" />
                    </button>
                    <h2 className="text-base font-black text-gray-900">팀 일정</h2>
                    <div className="w-8" />
                </div>
            </header>

            {/* 주간 날짜 선택 */}
            <div className="px-4 pt-4 pb-2">
                <div className="flex items-center justify-between mb-3">
                    <button onClick={prevWeek} className="p-1.5 text-gray-400 text-xs font-bold">← 이전</button>
                    <span className="text-xs font-black text-gray-500">
                        {weekDates[0].getMonth() + 1}월 {weekDates[0].getDate()}일 – {weekDates[6].getDate()}일
                    </span>
                    <button onClick={nextWeek} className="p-1.5 text-gray-400 text-xs font-bold">다음 →</button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {weekDates.map(d => {
                        const ds = toDateStr(d);
                        const isSelected = ds === selectedDate;
                        const isToday = ds === todayStr;
                        const hasEvent = sharedEvents.some(e => e.date === ds);
                        return (
                            <button
                                key={ds}
                                onClick={() => setSelectedDate(ds)}
                                className={`flex flex-col items-center py-2.5 rounded-2xl transition-all ${isSelected ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                <span className="text-[10px] font-bold uppercase">{DAYS_KR[d.getDay()]}</span>
                                <span className={`text-base font-black mt-0.5 ${isToday && !isSelected ? 'text-red-500' : ''}`}>{d.getDate()}</span>
                                <div className={`w-1 h-1 rounded-full mt-1 ${hasEvent ? (isSelected ? 'bg-white' : 'bg-red-400') : 'bg-transparent'}`} />
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 선택된 날 이벤트 목록 */}
            <div className="px-5 pt-4">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                    {selectedDate.slice(5).replace('-', '월 ')}일 팀 일정
                </p>
                <AnimatePresence mode="wait">
                    <motion.div key={selectedDate} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        {selectedEvents.length === 0
                            ? <div className="text-center py-16 text-sm font-bold text-gray-300">이 날은 팀 일정이 없습니다.</div>
                            : selectedEvents.map(ev => {
                                const cfg = TYPE_CONFIG[ev.type as 'match' | 'training'];
                                return (
                                    <div key={ev.id} className={`rounded-2xl p-4 border ${cfg.bg} ${cfg.border} mb-3`}>
                                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                                        <p className="font-black text-gray-900 text-sm mt-1">{ev.title}</p>
                                        <div className="flex items-center space-x-3 mt-2">
                                            <span className="flex items-center space-x-1 text-[11px] font-bold text-gray-400"><Clock size={11} /><span>{ev.startTime}–{ev.endTime}</span></span>
                                            <span className="flex items-center space-x-1 text-[11px] font-bold text-gray-400"><MapPin size={11} /><span>{ev.location}</span></span>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </motion.div>
                </AnimatePresence>
            </div>
        </main>
    );
}
