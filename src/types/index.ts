"use client";

import React from 'react';
import { User, ClipboardList, Activity, Calendar, MessageSquare, CreditCard, BarChart3 } from 'lucide-react';

export type UserMode = 'coach' | 'player' | 'parent';

export type MedicalStatus = 'normal' | 'warn' | 'rehab';

export interface Player {
    id: string;
    name: string;
    number: number;
    position: string;
    medicalStatus: MedicalStatus;
    physicalStats: {
        speed: number;
        stamina: number;
        technique: number;
        strength: number;
        aggression: number;
        passing: number;
    };
}

export interface Notice {
    id: string;
    title: string;
    content: string;
    date: string;
    isImportant: boolean;
}

export interface ScheduleEvent {
    id: string;
    title: string;
    type: 'match' | 'training' | 'meeting';
    date: string;
    time: string;
    location: string;
}
