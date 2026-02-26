"use client";

import React, { useState } from 'react';
import { ArrowLeft, Send, User, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

// 초기 채팅 목록은 비어있는 상태로 둡니다.
const INITIAL_CHATS: any[] = [];

export default function FeedbackPage() {
    const router = useRouter();
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const [chats, setChats] = useState(INITIAL_CHATS);

    return (
        <main className="min-h-screen bg-white max-w-lg mx-auto flex flex-col">
            {/* Header */}
            <header className="p-6 flex items-center justify-between border-b border-gray-50 bg-white sticky top-0 z-10">
                <div className="flex items-center space-x-4">
                    <button onClick={() => selectedChat ? setSelectedChat(null) : router.back()} className="p-2 -ml-2 text-gray-400">
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-lg font-black tracking-tight text-gray-900 italic uppercase">
                        {selectedChat ? chats.find(c => c.id === selectedChat)?.name : 'Feedback'}
                    </h2>
                </div>
            </header>

            {!selectedChat ? (
                /* Chat List */
                <div className="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col items-center justify-center text-center">
                    {chats.length === 0 ? (
                        <div className="py-20">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
                                <User size={32} />
                            </div>
                            <p className="text-sm font-bold text-gray-400">활성화된 채팅이 없습니다.</p>
                        </div>
                    ) : (
                        chats.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => setSelectedChat(chat.id)}
                                className="w-full flex items-center justify-between p-4 rounded-[28px] hover:bg-gray-50 transition-all active:scale-[0.98]"
                            >
                                <div className="flex items-center space-x-4 flex-1">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold border-2 border-white shadow-sm">
                                        {chat.name[0]}
                                    </div>
                                    <div className="text-left flex-1 min-w-0">
                                        <div className="font-bold text-gray-900">{chat.name}</div>
                                        <div className="text-xs text-gray-400 truncate">{chat.lastMessage}</div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end space-y-1">
                                    <span className="text-[10px] font-bold text-gray-300">{chat.time}</span>
                                    {chat.unread > 0 && (
                                        <span className="bg-xion-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{chat.unread}</span>
                                    )}
                                </div>
                            </button>
                        ))
                    )}
                </div>
            ) : (
                /* Chat Detail (Simple) */
                <div className="flex-1 flex flex-col bg-gray-50/50">
                    <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                        <p className="text-center text-[10px] font-bold text-gray-300 py-10 italic">대화 내용이 없습니다.</p>
                    </div>
                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100 safe-area-bottom">
                        <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-2xl">
                            <input
                                type="text"
                                placeholder="메시지를 입력하세요"
                                className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-sm font-medium"
                            />
                            <button className="p-2 bg-xion-red text-white rounded-xl shadow-lg shadow-xion-red/20 active:scale-90 transition-transform">
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
