export type CefrLevel = 'A1' | 'A2' | 'B1' | null;

export interface LevelInfo {
  level: string;
  subtitle: string;
  color: string;
}

const LEVEL_MAP: Record<string, LevelInfo> = {
  A1: { level: 'A1', subtitle: '入门', color: '#10B981' },
  A2: { level: 'A2', subtitle: '初级', color: '#3B82F6' },
  B1: { level: 'B1', subtitle: '中级', color: '#8B5CF6' },
};

export function getLevelInfo(cefrLevel: CefrLevel): LevelInfo {
  if (!cefrLevel) {
    return { level: '--', subtitle: '未测评', color: '#9CA3AF' };
  }
  return LEVEL_MAP[cefrLevel] || { level: cefrLevel, subtitle: '未知', color: '#9CA3AF' };
}
