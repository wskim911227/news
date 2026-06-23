export interface NewsItem {
  rank: number;
  title: string;
  summary: string;
  url: string;
}

export interface WeatherInfo {
  location: string;
  condition: string;
  temperature: string;
  high: string;
  low: string;
  tip: string;
}

export interface KboGame {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  result: string;
}

export interface DailyBriefing {
  date: string;
  generatedAt: string;
  topNews: NewsItem[];
  weather: WeatherInfo;
  kboResults: KboGame[];
}
