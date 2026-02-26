"use client";

import React from 'react';
import { ArrowLeft, CreditCard, Bell, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BillingPage() {
    const router = useRouter();

    return (
        <main className="min-h-screen bg-white p-6 pb-24 max-w-lg mx-auto font-pretendard">
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-400">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-lg font-black tracking-tight text-gray-900 italic uppercase">Billing & Alerts</h2>
                <div className="w-10"></div>
            </header>

            {/* Global Setting Card */}
            <div className="bg-gray-900 p-6 rounded-[32px] text-white mb-8 shadow-2xl shadow-gray-900/10">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/10 rounded-2xl">
                        <Bell size={24} className="text-xion-red" />
                    </div>
                    <div className="px-3 py-1 bg-xion-red text-white text-[10px] font-black rounded-full uppercase">Settings</div>
                </div>
                <h3 className="text-xl font-bold mb-2">자동 결제 알림 시스템</h3>
                <p className="text-white/60 text-xs font-medium leading-relaxed">
                    미납 내역이 있는 학부모님께 자동으로<br />
                    카카오 알림톡을 발송하도록 설정할 수 있습니다.
                </p>
                <button className="mt-6 w-full py-3 bg-white text-gray-900 rounded-2xl font-black text-sm active:scale-95 transition-transform">
                    알림 시스템 설정하기
                </button>
            </div>

            {/* Status List */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-1 mb-2">
                    <h4 className="font-bold text-gray-900 italic uppercase underline decoration-xion-red decoration-2">Payment Status</h4>
                    <span className="text-[10px] font-black text-gray-400 italic">2026.02</span>
                </div>

                <div className="py-20 flex flex-col items-center justify-center text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                        <CreditCard size={24} className="text-gray-200" />
                    </div>
                    <p className="text-sm font-bold text-gray-300">결제 관리 내역이 비어있습니다.</p>
                </div>
            </section>
        </main>
    );
}

function PaymentCard({ name, status, date, amount }: { name: string, status: 'paid' | 'unpaid', date?: string, amount?: string }) {
    const isPaid = status === 'paid';
    return (
        <div className="flex items-center justify-between p-5 bg-gray-50 rounded-3xl border border-transparent hover:border-gray-200 transition-all">
            <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-xl ${isPaid ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {isPaid ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                </div>
                <div>
                    <div className="font-bold text-gray-900">{name}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{isPaid ? `결제완료: ${date}` : `미납금: ${amount}`}</div>
                </div>
            </div>
            {!isPaid && (
                <button className="px-3 py-1.5 bg-xion-red text-white text-[10px] font-black rounded-xl shadow-lg shadow-xion-red/10 active:scale-90 transition-transform">
                    RE-SEND
                </button>
            )}
        </div>
    );
}
