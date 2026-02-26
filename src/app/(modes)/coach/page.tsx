"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    Settings,
    Plus,
    X,
    Megaphone,
    Activity,
    Calendar,
    ChevronRight,
    Search,
    Filter,
    MoreHorizontal,
    UserPlus,
    CheckCircle2,
    AlertCircle,
    CreditCard,
    MessageCircle
} from 'lucide-react';
import { useNotices } from '@/hooks/useStore';
import { PLAYERS, Player } from '@/constants/players';

// ============================================================
// 앱 활동 알림 타입 & 상수
// ============================================================
type NotifType = 'join' | 'schedule' | 'payment' | 'chat';

interface AppNotification {
    id: string;
    type: NotifType;
    message: string;
    time: string;
    read: boolean;
}

const NOTIF_CONFIG: Record<NotifType, { Icon: React.ElementType; bg: string; text: string }> = {
    join: { Icon: UserPlus, bg: 'bg-blue-50', text: 'text-blue-500' },
    schedule: { Icon: Calendar, bg: 'bg-purple-50', text: 'text-purple-500' },
    payment: { Icon: CreditCard, bg: 'bg-green-50', text: 'text-green-500' },
    chat: { Icon: MessageCircle, bg: 'bg-orange-50', text: 'text-orange-500' },
};

// 사용자가 직접 확인할 수 있도록 초기 알림은 비워둡니다.
const INITIAL_NOTIFICATIONS: AppNotification[] = [];

// ============================================================
// 공지 추가 바텀시트
// ============================================================
function AddNoticeSheet({ onClose, onAdd }: { onClose: () => void; onAdd: (t: string, c: string, imp: boolean) => void }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isImportant, setIsImportant] = useState(false);
    const valid = title.trim() && content.trim();

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={onClose}>
            <motion.div
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                className="bg-white w-full rounded-t-[32px] p-6 pb-10"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-black text-gray-900">공지사항 작성</h3>
                    <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"><X size={16} /></button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl mb-4">
                    <span className="text-sm font-bold text-gray-700">📌 중요 공지로 표시</span>
                    <button onClick={() => setIsImportant(!isImportant)} className={`w-11 h-6 rounded-full relative transition-all ${isImportant ? 'bg-red-500' : 'bg-gray-200'}`}>
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${isImportant ? 'left-5' : 'left-0.5'}`} />
                    </button>
                </div>
                <input
                    value={title} onChange={e => setTitle(e.target.value)}
                    placeholder="공지 제목을 입력하세요 *"
                    className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 outline-none mb-3 placeholder-gray-300"
                />
                <textarea
                    value={content} onChange={e => setContent(e.target.value)}
                    rows={3} placeholder="공지 내용을 입력하세요 *"
                    className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 outline-none mb-5 placeholder-gray-300 resize-none"
                />
                <button
                    disabled={!valid}
                    onClick={() => { onAdd(title, content, isImportant); onClose(); }}
                    className="w-full bg-gray-900 text-white py-4 rounded-[24px] font-black text-sm disabled:opacity-30"
                >
                    등록하기
                </button>
            </motion.div>
        </motion.div>
    );
}

// ============================================================
// 알림 드롭다운 패널
// ============================================================
function NotificationPanel({
    notifications,
    onMarkAll,
    onClose
}: {
    notifications: AppNotification[];
    onMarkAll: () => void;
    onClose: () => void;
}) {
    const unread = notifications.filter(n => !n.read).length;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.18 }}
            className="absolute right-0 top-12 w-80 bg-white rounded-[24px] shadow-2xl border border-gray-100 z-50 overflow-hidden"
        >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <div className="flex items-center space-x-2">
                    <span className="font-black text-gray-900 text-sm">알림 {unread > 0 && `(${unread})`}</span>
                </div>
                {unread > 0 && (
                    <button onClick={onMarkAll} className="text-[11px] font-bold text-gray-400 hover:text-gray-700">모두 읽음</button>
                )}
            </div>
            <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="text-center py-8 text-xs font-bold text-gray-300">새로운 알림이 없습니다.</div>
                ) : notifications.map(n => {
                    const cfg = NOTIF_CONFIG[n.type];
                    return (
                        <div key={n.id} className={`flex items-start space-x-3 px-5 py-3.5 border-b border-gray-50 ${n.read ? 'opacity-40' : ''}`}>
                            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                                <cfg.Icon size={17} className={cfg.text} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-900 leading-snug">{n.message}</p>
                                <p className="text-[10px] text-gray-400 font-medium mt-0.5">{n.time}</p>
                            </div>
                            {!n.read && <div className="w-2 h-2 bg-red-500 rounded-full shrink-0 mt-1" />}
                        </div>
                    );
                })}
            </div>
            <button onClick={onClose} className="w-full py-3 text-xs font-black text-gray-400 hover:text-gray-900 transition-colors">닫기</button>
        </motion.div>
    );
}

// ============================================================
// 메인 대시보드
// ============================================================
export default function CoachDashboardHome() {
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [bannerTab, setBannerTab] = useState<'notice' | 'condition'>('notice');
    const [listType, setListType] = useState<'all' | 'issue'>('all');
    const [isAlerting, setIsAlerting] = useState<string | null>(null);
    const [showAddNotice, setShowAddNotice] = useState(false);
    const [showNotifPanel, setShowNotifPanel] = useState(false);

    // ✅ 알림 상태를 부모에서 관리 → 뱃지와 패널이 같은 상태를 바라봄
    const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    const { notices, addNotice } = useNotices();

    useEffect(() => {
        const name = localStorage.getItem('plana_user_name');
        if (name) setUserName(name);
    }, []);

    const handlePushAlert = (name: string) => {
        setIsAlerting(name);
        setTimeout(() => setIsAlerting(null), 2000);
    };

    const handleAddNotice = (title: string, content: string, isImportant: boolean) => {
        const today = new Date().toISOString().slice(0, 10);
        addNotice({ title, content, date: today, isImportant });
    };

    // 오늘 체크인 안 한 선수
    const notCheckedIn = PLAYERS.filter(p => !p.checkedIn);
    // 주의/재활 선수
    const issueCount = PLAYERS.filter(p => p.status !== '정상').length;

    return (
        <main className="min-h-screen bg-white pb-36 font-pretendard">

            {/* 1. Header */}
            <header className="px-5 pt-6 pb-2 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 flex items-center justify-center">
                        <img src="/plana_logo.png" alt="PlanA" className="w-full h-auto" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-gray-900 tracking-tight">
                            {userName ? `${userName} 코치님` : 'PlanA 코치'}
                        </h1>
                        <p className="text-[10px] font-bold text-gray-400">Premium Performance System</p>
                    </div>
                </div>
                <div className="flex items-center space-x-1 relative">
                    {/* 알림 벨 */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifPanel(v => !v)}
                            className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                            <Bell size={22} strokeWidth={2.5} className="text-gray-400" />
                            {/* unreadCount가 0이면 뱃지 미표시 */}
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-black text-white">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        <AnimatePresence>
                            {showNotifPanel && (
                                <NotificationPanel
                                    notifications={notifications}
                                    onMarkAll={markAllRead}
                                    onClose={() => setShowNotifPanel(false)}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                    <Link href="/coach/settings" className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                        <Settings size={22} strokeWidth={2.5} className="text-gray-400" />
                    </Link>
                </div>
            </header>
            {/* 알림 패널 외부 클릭 닫기 */}
            {showNotifPanel && <div className="fixed inset-0 z-40" onClick={() => setShowNotifPanel(false)} />}

            {/* 2. 주요공지 & 컨디션 배너 */}
            <section className="px-5 py-4">
                <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex space-x-4">
                        <button onClick={() => setBannerTab('notice')} className={`text-xs font-bold transition-colors ${bannerTab === 'notice' ? 'text-gray-900' : 'text-gray-300'}`}>주요공지</button>
                        <button onClick={() => setBannerTab('condition')} className={`text-xs font-bold transition-colors ${bannerTab === 'condition' ? 'text-gray-900' : 'text-gray-300'}`}>컨디션 관리</button>
                    </div>
                    {bannerTab === 'notice' && (
                        <button onClick={() => setShowAddNotice(true)} className="w-7 h-7 bg-gray-900 text-white rounded-xl flex items-center justify-center">
                            <Plus size={15} strokeWidth={3} />
                        </button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {bannerTab === 'notice' ? (
                        <motion.div key="notice" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            {notices.length === 0 ? (
                                <button
                                    onClick={() => setShowAddNotice(true)}
                                    className="w-full bg-gray-50 rounded-3xl p-5 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center min-h-[90px] hover:border-gray-400 transition-colors"
                                >
                                    <Megaphone size={22} className="text-gray-300 mb-2" />
                                    <p className="text-xs font-bold text-gray-400">+ 첫 공지를 등록해보세요</p>
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    {notices.slice(0, 3).map(n => (
                                        <div key={n.id} className="bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 flex items-start space-x-3">
                                            {n.isImportant && <span className="shrink-0 mt-0.5 px-1.5 py-0.5 bg-red-500 text-white text-[8px] font-black rounded">중요</span>}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-black text-gray-900 truncate">{n.title}</p>
                                                <p className="text-[11px] text-gray-400 font-medium mt-0.5 line-clamp-1">{n.content}</p>
                                            </div>
                                            <span className="text-[10px] text-gray-300 font-bold shrink-0">{n.date.slice(5)}</span>
                                        </div>
                                    ))}
                                    {notices.length > 3 && (
                                        <Link href="/coach/notice" className="block text-center text-[11px] font-black text-gray-400 hover:text-gray-700 py-1">
                                            전체보기 ({notices.length}개) →
                                        </Link>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div key="condition" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500">
                                        <AlertCircle size={20} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900">주의 선수 {issueCount}명</h4>
                                        <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                                            {PLAYERS.filter(p => p.status !== '정상').map(p => p.name).join(', ')} 관리 중
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-gray-300" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* 3. Daily Check-in 미입력 선수 */}
            <section className="py-2">
                <div className="px-6 mb-4 flex justify-between items-center">
                    <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Daily Check-in</span>
                        <p className="text-[11px] font-bold text-gray-900 mt-0.5">
                            미입력 선수 {notCheckedIn.length}명
                        </p>
                    </div>
                    <button
                        onClick={() => handlePushAlert('전체 선수')}
                        className="px-3 py-1.5 bg-red-500 text-white text-[9px] font-bold rounded-xl shadow-lg shadow-red-200 active:scale-95 transition-all"
                    >
                        전체 알림 발송
                    </button>
                </div>

                {notCheckedIn.length === 0 ? (
                    <p className="px-6 text-xs font-bold text-green-500">✅ 모든 선수가 오늘 체크인을 완료했습니다!</p>
                ) : (
                    <div className="flex space-x-4 overflow-x-auto no-scrollbar px-6 pb-6">
                        {notCheckedIn.map(player => (
                            <div key={player.id} className="flex-shrink-0 flex flex-col items-center space-y-2">
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handlePushAlert(player.name)}
                                    className="relative overflow-visible"
                                >
                                    <div className="w-14 h-14 rounded-[20px] bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                                        <UserPlus size={24} strokeWidth={2} className="text-blue-300" />
                                    </div>
                                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center z-10">
                                        <span className="text-[9px] font-black text-white leading-none">!</span>
                                    </div>
                                </motion.button>
                                <span className="text-[10px] text-gray-600 font-bold w-14 truncate text-center">{player.name}</span>
                                <span className="text-[9px] text-gray-400 font-bold">{player.position}</span>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* 4. 선수 명단 */}
            <section className="mt-6">
                <div className="px-6 mb-4 flex justify-between items-end">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">Players</h3>
                        <p className="text-[11px] font-bold text-gray-400 mt-1">총 {PLAYERS.length}명 등록</p>
                    </div>
                    <div className="flex bg-gray-50 rounded-2xl p-1 border border-gray-100">
                        <button onClick={() => setListType('all')} className={`px-4 py-1.5 rounded-xl text-[10px] font-bold transition-all ${listType === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>명단</button>
                        <button onClick={() => setListType('issue')} className={`px-4 py-1.5 rounded-xl text-[10px] font-bold transition-all ${listType === 'issue' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>주의/재활</button>
                    </div>
                </div>
                <div className="px-6 space-y-1 pb-28">
                    {PLAYERS
                        .filter(p => listType === 'all' || p.status !== '정상')
                        .map(player => (
                            <Link key={player.id} href={`/coach/player/${player.id}`}>
                                <div className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0 px-1 group">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <div className="w-11 h-11 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-400 text-xs font-black">
                                                {player.position}
                                            </div>
                                            {player.status !== '정상' && (
                                                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white shadow-sm" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900">{player.name}</p>
                                            <p className="text-[11px] font-medium text-gray-400 mt-0.5">{player.status}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-200 group-hover:text-gray-400 transition-colors" />
                                </div>
                            </Link>
                        ))
                    }
                </div>
            </section>

            {/* Toast */}
            <AnimatePresence>
                {isAlerting && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 pointer-events-none"
                    >
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"><Bell size={12} fill="white" /></div>
                        <span className="text-sm font-bold whitespace-nowrap">{isAlerting}님께 푸시 알림을 보냈습니다.</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 공지 추가 바텀시트 */}
            <AnimatePresence>
                {showAddNotice && <AddNoticeSheet onClose={() => setShowAddNotice(false)} onAdd={handleAddNotice} />}
            </AnimatePresence>
        </main>
    );
}
