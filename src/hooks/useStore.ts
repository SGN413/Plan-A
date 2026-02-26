// 코치 일정/공지 공유를 위한 localStorage 기반 공유 스토어 훅
// 훈련(training)과 경기(match)는 선수에게도 보임, 나머지는 코치 전용

import { useState, useEffect, useCallback } from 'react';

export interface SharedEvent {
    id: string;
    title: string;
    type: 'match' | 'training' | 'meeting' | 'other';
    date: string;         // YYYY-MM-DD
    startTime: string;    // HH:MM
    endTime: string;      // HH:MM
    location: string;
    memo?: string;
    createdAt: number;
}

export interface Notice {
    id: string;
    title: string;
    content: string;
    date: string;         // YYYY-MM-DD
    isImportant: boolean;
    createdAt: number;
}

// 선수에게 공유되는 타입
export const SHARED_TYPES: SharedEvent['type'][] = ['match', 'training'];

const EVENTS_KEY = 'plana_events';
const NOTICES_KEY = 'plana_notices';

function loadFromStorage<T>(key: string, defaults: T[]): T[] {
    if (typeof window === 'undefined') return defaults;
    try {
        const raw = localStorage.getItem(key);
        if (!raw) {
            localStorage.setItem(key, JSON.stringify(defaults));
            return defaults;
        }
        return JSON.parse(raw);
    } catch {
        return defaults;
    }
}

function saveToStorage<T>(key: string, data: T[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
}

// ===== 이벤트 훅 =====
export function useEvents() {
    const [events, setEvents] = useState<SharedEvent[]>([]);

    useEffect(() => {
        setEvents(loadFromStorage<SharedEvent>(EVENTS_KEY, []));
    }, []);

    const addEvent = useCallback((ev: Omit<SharedEvent, 'id' | 'createdAt'>) => {
        setEvents(prev => {
            const next = [...prev, { ...ev, id: String(Date.now()), createdAt: Date.now() }];
            saveToStorage(EVENTS_KEY, next);
            return next;
        });
    }, []);

    const deleteEvent = useCallback((id: string) => {
        setEvents(prev => {
            const next = prev.filter(e => e.id !== id);
            saveToStorage(EVENTS_KEY, next);
            return next;
        });
    }, []);

    return { events, addEvent, deleteEvent };
}

// ===== 공지 훅 =====
export function useNotices() {
    const [notices, setNotices] = useState<Notice[]>([]);

    useEffect(() => {
        setNotices(loadFromStorage<Notice>(NOTICES_KEY, []));
    }, []);

    const addNotice = useCallback((n: Omit<Notice, 'id' | 'createdAt'>) => {
        setNotices(prev => {
            const next = [{ ...n, id: String(Date.now()), createdAt: Date.now() }, ...prev];
            saveToStorage(NOTICES_KEY, next);
            return next;
        });
    }, []);

    const deleteNotice = useCallback((id: string) => {
        setNotices(prev => {
            const next = prev.filter(n => n.id !== id);
            saveToStorage(NOTICES_KEY, next);
            return next;
        });
    }, []);

    return { notices, addNotice, deleteNotice };
}
