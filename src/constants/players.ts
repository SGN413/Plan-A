// 실제 등록 선수 11명 공통 상수
export interface Player {
    id: string;
    name: string;
    position: string;
    status: '정상' | '주의' | '재활';
    checkedIn: boolean;
}

export const PLAYERS: Player[] = [
    { id: 'p01', name: '김민준', position: 'GK', status: '정상', checkedIn: false },
    { id: 'p02', name: '이서준', position: 'DF', status: '정상', checkedIn: true },
    { id: 'p03', name: '박현우', position: 'DF', status: '주의', checkedIn: false },
    { id: 'p04', name: '최도현', position: 'DF', status: '정상', checkedIn: true },
    { id: 'p05', name: '정시우', position: 'DF', status: '재활', checkedIn: false },
    { id: 'p06', name: '강준혁', position: 'MF', status: '정상', checkedIn: true },
    { id: 'p07', name: '윤재원', position: 'MF', status: '정상', checkedIn: false },
    { id: 'p08', name: '임성민', position: 'MF', status: '주의', checkedIn: true },
    { id: 'p09', name: '한동훈', position: 'FW', status: '정상', checkedIn: false },
    { id: 'p10', name: '신태양', position: 'FW', status: '정상', checkedIn: true },
    { id: 'p11', name: '오준서', position: 'FW', status: '정상', checkedIn: false },
];
