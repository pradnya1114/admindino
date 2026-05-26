export interface AppSettings {
  logoUrl: string;
  backgroundColor: string;
  backgroundImageUrl: string;
}

export interface ScoreEntry {
  name: string;
  score: number;
  date: string;
  id?: number;
}
