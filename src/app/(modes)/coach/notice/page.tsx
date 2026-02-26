"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Search, MoreHorizontal, X, AlertCircle } from 'lucide-react';
import { useNotices, Notice } from '@/hooks/useStore';

// ============================================================
// 공지 추가 바텀시트
// ============================================================
function AddNoticeModal({ onClose, onAdd }: { onClose: () => void; onAdd: (n: Omit<Notice, 'id' | 'createdAt'>) => void }) {
    const today = new Date().toISOString().slice(0, 10);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isImportant, setIsImportant] = useState(false);

    const isValid = title.trim() && content.trim();

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={onClose}>
            <motion.div
                initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white w-full rounded-t-[32px] p-6 pb-10 max-h-[85vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-gray-900">공지사항 작성</h3>
                    <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"><X size={16} /></button>
                </div>

                {/* 중요 공지 토글 */}
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100 mb-5">
                    <div className="flex items-center space-x-2">
                        <AlertCircle size={16} className="text-red-500" />
                        <span className="text-sm font-black text-red-700">중요 공지로 표시</span>
                    </div>
                    <button
                        onClick={() => setIsImportant(!isImportant)}
                        className={`w-12 h-6 rounded-full transition-all relative ${isImportant ? 'bg-red-500' : 'bg-gray-200'}`}
                    >
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${isImportant ? 'left-6' : 'left-0.5'}`} />
                    </button>
                </div>

                {/* 제목 */}
                <div className="mb-4">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">제목 *</label>
                    <input
                        value={title} onChange={e => setTitle(e.target.value)}
                        placeholder="공지 제목을 입력하세요"
                        className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-gray-200 placeholder-gray-300"
                    />
                </div>

                {/* 내용 */}
                <div className="mb-6">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">내용 *</label>
                    <textarea
                        value={content} onChange={e => setContent(e.target.value)}
                        rows={4} placeholder="공지 내용을 입력하세요"
                        className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-gray-200 placeholder-gray-300 resize-none"
                    />
                </div>

                <button
                    disabled={!isValid}
                    onClick={() => { onAdd({ title, content, date: today, isImportant }); onClose(); }}
                    className="w-full bg-gray-900 text-white py-4 rounded-[24px] font-black text-base disabled:opacity-30 transition-all"
                >
                    공지 등록하기
                </button>
            </motion.div>
        </motion.div>
    );
}

// ============================================================
// 메인 공지사항 페이지
// ============================================================
export default function NoticePage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const { notices, addNotice, deleteNotice } = useNotices();

    const filtered = notices.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <main className="min-h-screen bg-white p-6 pb-28 max-w-lg mx-auto font-pretendard">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-400"><ArrowLeft size={24} /></button>
                    <h2 className="text-lg font-black tracking-tight text-gray-900">공지사항</h2>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="w-9 h-9 bg-gray-900 text-white rounded-xl flex items-center justify-center"
                    >
                        <Plus size={20} />
                    </button>
                </header>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                        type="text" placeholder="공지 검색"
                        className="w-full bg-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-gray-200 outline-none"
                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Notice List */}
                <div className="space-y-3">
                    {filtered.length === 0 && (
                        <div className="text-center py-16 text-sm font-bold text-gray-300">
                            {searchTerm ? '검색 결과가 없습니다.' : '공지사항이 없습니다.\n+ 버튼으로 첫 공지를 작성해보세요!'}
                        </div>
                    )}
                    <AnimatePresence>
                        {filtered.map((notice) => (
                            <motion.div
                                key={notice.id}
                                layout
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                className="p-5 rounded-3xl border border-gray-100 bg-white hover:border-gray-200 transition-all group relative"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center space-x-2">
                                        {notice.isImportant && (
                                            <span className="px-2 py-0.5 bg-red-500 text-white text-[9px] font-black rounded uppercase">중요</span>
                                        )}
                                        <span className="text-xs font-bold text-gray-300">{notice.date}</span>
                                    </div>
                                    <div className="relative">
                                        <button
                                            onClick={() => setOpenMenuId(openMenuId === notice.id ? null : notice.id)}
                                            className="text-gray-300 hover:text-gray-500 transition-colors"
                                        >
                                            <MoreHorizontal size={18} />
                                        </button>
                                        {openMenuId === notice.id && (
                                            <div className="absolute right-0 top-8 bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden z-10 w-28">
                                                <button
                                                    onClick={() => { deleteNotice(notice.id); setOpenMenuId(null); }}
                                                    className="w-full flex items-center space-x-2 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50"
                                                >
                                                    <span>삭제</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <h3 className="font-black text-gray-900 mb-1">{notice.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{notice.content}</p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </main>

            <AnimatePresence>
                {showAddModal && <AddNoticeModal onClose={() => setShowAddModal(false)} onAdd={addNotice} />}
            </AnimatePresence>
        </>
    );
}
