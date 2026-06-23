import { GoogleGenAI } from "@google/genai";
import type { KboGame, KboScheduledGame } from "./types";
import { extractJsonArray } from "./json";

const MODEL = "gemini-2.5-flash";
const SEARCH_CONFIG = {
  tools: [{ googleSearch: {} }],
  temperature: 0.1,
};

export async function fetchKboSchedule(
  ai: GoogleGenAI,
  today: string
): Promise<KboScheduledGame[]> {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `Google 검색으로 ${today} KBO 프로야구 오늘 예정 경기 일정 전체를 조회하세요.
KBO.com, 네이버 스포츠, 다음 스포츠 등에서 오늘(${today}) 경기 일정을 확인하세요.

정규시즌에는 보통 하루 5경기(10개 팀)가 열립니다. 오늘 예정된 모든 경기를 빠짐없이 포함하세요.
취소·우천 취소된 경기는 제외하고, 실제 예정된 경기만 포함하세요.

순수 JSON 배열만 출력하세요 (마크다운·코드블록 금지):
[
  {
    "homeTeam": "LG 트윈스",
    "awayTeam": "두산 베어스",
    "startTime": "18:30",
    "stadium": "잠실야구장"
  },
  {
    "homeTeam": "KIA 타이거즈",
    "awayTeam": "SSG 랜더스",
    "startTime": "18:30",
    "stadium": "광주기아챔피언스필드"
  }
]

규칙:
- 오늘(${today}) 예정 경기만
- 10개 팀 모두 확인, 경기 누락 금지
- startTime은 "HH:MM" 24시간 형식
- 팀명은 KBO 공식 명칭
- startTime 오름차순 정렬`,
    config: SEARCH_CONFIG,
  });

  const rawText = response.text;
  if (!rawText) return [];

  try {
    const parsed = JSON.parse(extractJsonArray(rawText)) as KboScheduledGame[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function fetchKboResults(
  ai: GoogleGenAI,
  yesterday: string
): Promise<KboGame[]> {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `Google 검색으로 ${yesterday} KBO 프로야구 경기 결과 전체를 조회하세요.
KBO.com, 네이버 스포츠, 다음 스포츠 등에서 어제(${yesterday}) 종료된 모든 경기 결과를 확인하세요.

정규시즌에는 보통 하루 5경기가 있습니다. 어제 경기 결과를 빠짐없이 포함하세요.

순수 JSON 배열만 출력하세요 (마크다운·코드블록 금지):
[
  {
    "homeTeam": "LG 트윈스",
    "awayTeam": "두산 베어스",
    "homeScore": 5,
    "awayScore": 3,
    "result": "5 : 3 LG 트윈스 승"
  }
]

규칙:
- 어제(${yesterday}) 종료된 경기만
- 모든 경기 결과 포함, 누락 금지
- 팀명은 KBO 공식 명칭`,
    config: SEARCH_CONFIG,
  });

  const rawText = response.text;
  if (!rawText) return [];

  try {
    const parsed = JSON.parse(extractJsonArray(rawText)) as KboGame[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
