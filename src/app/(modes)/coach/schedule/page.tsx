"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock, Dumbbell, Trophy, Users2, X } from 'lucide-react';
import { useEvents, SharedEvent, SHARED_TYPES } from '@/hooks/useStore';

// ============================================================
// 상수 & 유틸
// ============================================================
const TYPE_CONFIG = {
    match: { label: '경기', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', dot: 'bg-red-500', badge: 'bg-red-500 text-white' },
    training: { label: '훈련', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', dot: 'bg-blue-500', badge: 'bg-blue-500 text-white' },
    meeting: { label: '미팅', bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', dot: 'bg-purple-500', badge: 'bg-purple-100 text-purple-700' },
    other: { label: '기타', bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-600' },
};

const DAYS_KR = ['일', '월', '화', '수', '목', '금', '토'];
const MONTHS_KR = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

type ViewMode = 'today' | 'week' | 'month';

function toDateStr(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getWeekDates(date: Date): Date[] {
    const d = new Date(date);
    const day = d.getDay();
    const mon = new Date(d);
    mon.setDate(d.getDate() - ((day + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => { const x = new Date(mon); x.setDate(mon.getDate() + i); return x; });
}

function getMonthGrid(year: number, month: number): (Date | null)[] {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startDay = (first.getDay() + 6) % 7;
    const result: (Date | null)[] = [];
    for (let i = 0; i < startDay; i++) result.push(null);
    for (let d = 1; d <= last.getDate(); d++) result.push(new Date(year, month, d));
    while (result.length % 7 !== 0) result.push(null);
    return result;
}

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

function timeToMinutes(t: string) { const [h, m] = t.split(':').map(Number); return h * 60 + m; }

// ============================================================
// 이벤트 카드
// ============================================================
function EventCard({ event }: { event: SharedEvent }) {
    const cfg = TYPE_CONFIG[event.type];
    const isShared = SHARED_TYPES.includes(event.type);
    return (
        <div className={`rounded-2xl p-4 border ${cfg.bg} ${cfg.border} mb-3`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-md ${cfg.badge}`}>{cfg.label}</span>
                        {isShared && <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md border border-green-200">📢 팀 공유</span>}
                    </div>
                    <p className="font-black text-gray-900 text-sm">{event.title}</p>
                    <div className="flex items-center space-x-3 mt-2">
                        <span className="flex items-center space-x-1 text-[11px] font-bold text-gray-400"><Clock size={11} /><span>{event.startTime}–{event.endTime}</span></span>
                        <span className="flex items-center space-x-1 text-[11px] font-bold text-gray-400"><MapPin size={11} /><span>{event.location}</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// 일정 추가 모달
// ============================================================
function AddEventModal({ onClose, onAdd }: { onClose: () => void; onAdd: (ev: Omit<SharedEvent, 'id' | 'createdAt'>) => void }) {
    const today = toDateStr(new Date());
    const [form, setForm] = useState({
        title: '', type: 'training' as SharedEvent['type'],
        date: today, startTime: '10:00', endTime: '12:00',
        location: '', memo: '',
    });
    const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
    const isValid = form.title.trim() && form.date && form.startTime && form.endTime && form.location.trim();

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={onClose}>
            <motion.div
                initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white w-full rounded-t-[32px] p-6 pb-10 max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-gray-900">새 일정 추가</h3>
                    <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"><X size={16} /></button>
                </div>

                {/* 유형 선택 */}
                <div className="mb-5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">일정 유형</label>
                    <div className="grid grid-cols-4 gap-2">
                        {(['match', 'training', 'meeting', 'other'] as SharedEvent['type'][]).map(t => {
                            const cfg = TYPE_CONFIG[t];
                            const isShared = SHARED_TYPES.includes(t);
                            return (
                                <button key={t} onClick={() => set('type', t)} className={`p-3 rounded-2xl border-2 text-center transition-all ${form.type === t ? `${cfg.bg} ${cfg.border} ${cfg.text}` : 'border-gray-100 text-gray-400'}`}>
                                    <p className="text-xs font-black">{cfg.label}</p>
                                    {isShared && <p className="text-[9px] text-green-500 mt-0.5">공유</p>}
                                </button>
                            );
                        })}
                    </div>
                    {SHARED_TYPES.includes(form.type) && (
                        <p className="text-xs font-bold text-green-600 mt-2 flex items-center space-x-1"><span>📢</span><span>훈련/경기는 팀 선수들에게 자동으로 공유됩니다.</span></p>
                    )}
                </div>

                {/* 제목 */}
                <div className="mb-4">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">제목 *</label>
                    <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="일정 제목 입력" className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-gray-200 placeholder-gray-300" />
                </div>

                {/* 날짜 */}
                <div className="mb-4">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">날짜 *</label>
                    <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-gray-200" />
                </div>

                {/* 시간 */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">시작 *</label>
                        <input type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)} className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-gray-200" />
                    </div>
                    <div>
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">종료 *</label>
                        <input type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)} className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-gray-200" />
                    </div>
                </div>

                {/* 장소 */}
                <div className="mb-4">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">장소 *</label>
                    <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="예: 대운동장" className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-gray-200 placeholder-gray-300" />
                </div>

                {/* 메모 */}
                <div className="mb-6">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">메모 (선택)</label>
                    <textarea value={form.memo} onChange={e => set('memo', e.target.value)} rows={2} placeholder="추가 안내 사항" className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-gray-200 placeholder-gray-300 resize-none" />
                </div>

                <button
                    disabled={!isValid}
                    onClick={() => { onAdd(form); onClose(); }}
                    className="w-full bg-gray-900 text-white py-4 rounded-[24px] font-black text-base disabled:opacity-30 transition-all"
                >
                    일정 등록하기
                </button>
            </motion.div>
        </motion.div>
    );
}

// ============================================================
// 오늘 뷰
// ============================================================
function TodayView({ date, events }: { date: Date; events: SharedEvent[] }) {
    const todayStr = toDateStr(date);
    const todayEvents = events.filter(e => e.date === todayStr);
    return (
        <div>
            {todayEvents.length === 0 && <div className="text-center py-16 text-sm font-bold text-gray-300">오늘 일정이 없습니다.</div>}
            {TIME_SLOTS.map(slot => {
                const slotMin = timeToMinutes(slot);
                const slotEvents = todayEvents.filter(e => { const s = timeToMinutes(e.startTime); return s >= slotMin && s < slotMin + 60; });
                return (
                    <div key={slot} className="flex">
                        <div className="w-14 shrink-0 text-[11px] font-bold text-gray-300 pt-3 text-right pr-3">{slot}</div>
                        <div className="flex-1 border-t border-gray-50 min-h-[56px] pt-2 pb-1">
                            {slotEvents.map(ev => {
                                const cfg = TYPE_CONFIG[ev.type];
                                return (
                                    <div key={ev.id} className={`rounded-xl px-3 py-2 mb-1 border ${cfg.bg} ${cfg.border}`}>
                                        <p className={`text-xs font-black ${cfg.text}`}>{ev.title}</p>
                                        <p className="text-[10px] font-bold text-gray-400 mt-0.5">{ev.startTime}–{ev.endTime} · {ev.location}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ============================================================
// 주간 뷰
// ============================================================
function WeekView({ baseDate, events }: { baseDate: Date; events: SharedEvent[] }) {
    const weekDates = getWeekDates(baseDate);
    const todayStr = toDateStr(new Date());
    const [selectedDate, setSelectedDate] = useState(toDateStr(baseDate));
    const selectedEvents = events.filter(e => e.date === selectedDate);

    return (
        <div>
            <div className="grid grid-cols-7 gap-1 mb-6">
                {weekDates.map(d => {
                    const ds = toDateStr(d); const isSelected = ds === selectedDate; const isToday = ds === todayStr;
                    const hasEvent = events.some(e => e.date === ds);
                    return (
                        <button key={ds} onClick={() => setSelectedDate(ds)} className={`flex flex-col items-center py-2.5 rounded-2xl transition-all ${isSelected ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <span className="text-[10px] font-bold uppercase">{DAYS_KR[d.getDay()]}</span>
                            <span className={`text-base font-black mt-0.5 ${isToday && !isSelected ? 'text-red-500' : ''}`}>{d.getDate()}</span>
                            <div className={`w-1 h-1 rounded-full mt-1 ${hasEvent ? (isSelected ? 'bg-white' : 'bg-red-400') : 'bg-transparent'}`} />
                        </button>
                    );
                })}
            </div>
            <AnimatePresence mode="wait">
                <motion.div key={selectedDate} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">{selectedDate.slice(5).replace('-', '월 ')}일 일정</p>
                    {selectedEvents.length === 0
                        ? <div className="text-center py-12 text-sm font-bold text-gray-300">이 날은 일정이 없습니다.</div>
                        : selectedEvents.map(e => <EventCard key={e.id} event={e} />)
                    }
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

// ============================================================
// 월간 뷰
// ============================================================
function MonthView({ year, month, events, onDateClick }: { year: number; month: number; events: SharedEvent[]; onDateClick: (d: Date) => void }) {
    const grid = getMonthGrid(year, month);
    const todayStr = toDateStr(new Date());
    return (
        <div>
            <div className="grid grid-cols-7 mb-1">
                {['월', '화', '수', '목', '금', '토', '일'].map(d => <div key={d} className="text-center text-[11px] font-black text-gray-400 py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 border-t border-gray-100">
                {grid.map((d, i) => {
                    if (!d) return <div key={`e${i}`} className="border-b border-r border-gray-50 min-h-[72px]" />;
                    const ds = toDateStr(d); const dayEvents = events.filter(e => e.date === ds); const isToday = ds === todayStr;
                    return (
                        <button key={ds} onClick={() => onDateClick(d)} className="border-b border-r border-gray-50 min-h-[72px] p-1 text-left hover:bg-gray-50 transition-colors align-top">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 text-[12px] font-black ${isToday ? 'bg-gray-900 text-white' : 'text-gray-700'}`}>{d.getDate()}</div>
                            <div className="space-y-0.5">
                                {dayEvents.slice(0, 2).map(ev => {
                                    const cfg = TYPE_CONFIG[ev.type];
                                    return <div key={ev.id} className={`text-[9px] font-black px-1.5 py-0.5 rounded-md truncate ${cfg.bg} ${cfg.text}`}>{ev.title}</div>;
                                })}
                                {dayEvents.length > 2 && <div className="text-[9px] font-bold text-gray-400 px-1">+{dayEvents.length - 2}개 더</div>}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ============================================================
// 메인 페이지
// ============================================================
export default function SchedulePage() {
    const router = useRouter();
    const today = new Date();
    const [viewMode, setViewMode] = useState<ViewMode>('week');
    const [currentDate, setCurrentDate] = useState(today);
    const [displayYear, setDisplayYear] = useState(today.getFullYear());
    const [displayMonth, setDisplayMonth] = useState(today.getMonth());
    const [showAddModal, setShowAddModal] = useState(false);

    const { events, addEvent } = useEvents();

    const prevPeriod = () => {
        if (viewMode === 'today') { const d = new Date(currentDate); d.setDate(d.getDate() - 1); setCurrentDate(d); }
        else if (viewMode === 'week') { const d = new Date(currentDate); d.setDate(d.getDate() - 7); setCurrentDate(d); }
        else { if (displayMonth === 0) { setDisplayYear(y => y - 1); setDisplayMonth(11); } else setDisplayMonth(m => m - 1); }
    };
    const nextPeriod = () => {
        if (viewMode === 'today') { const d = new Date(currentDate); d.setDate(d.getDate() + 1); setCurrentDate(d); }
        else if (viewMode === 'week') { const d = new Date(currentDate); d.setDate(d.getDate() + 7); setCurrentDate(d); }
        else { if (displayMonth === 11) { setDisplayYear(y => y + 1); setDisplayMonth(0); } else setDisplayMonth(m => m + 1); }
    };

    const headerLabel = useMemo(() => {
        if (viewMode === 'today') return `${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일 (${DAYS_KR[currentDate.getDay()]})`;
        if (viewMode === 'week') { const wk = getWeekDates(currentDate); return `${wk[0].getMonth() + 1}월 ${wk[0].getDate()}일 – ${wk[6].getDate()}일`; }
        return `${displayYear}년 ${MONTHS_KR[displayMonth]}`;
    }, [viewMode, currentDate, displayYear, displayMonth]);

    return (
        <main className="min-h-screen bg-white pb-28 font-pretendard">
            <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 pt-6 pb-3 border-b border-gray-50">
                <div className="flex items-center justify-between mb-3">
                    <button onClick={() => router.back()} className="p-1 text-gray-400"><ChevronLeft size={24} /></button>
                    <div className="flex items-center space-x-2">
                        <button onClick={prevPeriod} className="p-1.5 text-gray-400"><ChevronLeft size={18} /></button>
                        <span className="text-sm font-black text-gray-900 min-w-[140px] text-center">{headerLabel}</span>
                        <button onClick={nextPeriod} className="p-1.5 text-gray-400"><ChevronRight size={18} /></button>
                    </div>
                    <button onClick={() => setShowAddModal(true)} className="w-8 h-8 bg-gray-900 text-white rounded-xl flex items-center justify-center">
                        <Plus size={18} />
                    </button>
                </div>
                <div className="flex bg-gray-100 rounded-2xl p-1">
                    {(['today', 'week', 'month'] as ViewMode[]).map(mode => (
                        <button key={mode} onClick={() => setViewMode(mode)} className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${viewMode === mode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>
                            {mode === 'today' ? '오늘' : mode === 'week' ? '주간' : '월간'}
                        </button>
                    ))}
                </div>
            </header>

            <div className="px-5 pt-5">
                <AnimatePresence mode="wait">
                    <motion.div key={viewMode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                        {viewMode === 'today' && <TodayView date={currentDate} events={events} />}
                        {viewMode === 'week' && <WeekView baseDate={currentDate} events={events} />}
                        {viewMode === 'month' && <MonthView year={displayYear} month={displayMonth} events={events} onDateClick={d => { setCurrentDate(d); setViewMode('week'); }} />}
                    </motion.div>
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {showAddModal && <AddEventModal onClose={() => setShowAddModal(false)} onAdd={addEvent} />}
            </AnimatePresence>
        </main>
    );
}
