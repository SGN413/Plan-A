// 실제 등록 선수 공통 상수
export interface Player {
    id: string;
    name: string;
    position: string;
    status: '정상' | '주의' | '재활';
    checkedIn: boolean;
}

// ✅ 모든 예시 선수를 제거하여 빈 리스트로 초기화합니다.
export const PLAYERS: Player[] = [];
