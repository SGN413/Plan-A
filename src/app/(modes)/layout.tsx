import React from 'react';
import BottomNav from '@/components/common/BottomNav';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="pb-24"> {/* BottomNav height + margin */}
            {children}
            <BottomNav />
        </div>
    );
}
