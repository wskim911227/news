import { GoogleGenAI } from "@google/genai";
import type { DailyBriefing } from "./types";
import { formatKstDate, getKstNow, getYesterdayLabel } from "./date";

const MODEL = "gemini-2.5-flash";

function buildPrompt(): string {
  const now = getKstNow();
  const today = formatKstDate(now);
  const yesterday = getYesterdayLabel(now);

  return `당신은 한국 뉴스 브리핑 에디터입니다. Google 검색을 활용해 최신 정보를 수집한 뒤, 아래 JSON 형식으로만 응답하세요. 마크다운이나 코드블록 없이 순수 JSON만 출력하세요.

오늘 날짜(한국): ${today}
어제 날짜(한국): ${yesterday}

수집 항목:
1. 어제(${yesterday}) 한국에서 가장 화제가 됐던 뉴스 TOP 5 — 실제 기사 원문 URL 필수(뉴스 포털·언론사 링크)
2. 오늘(${today}) 대한민국 서울 기준 날씨 — 현재 날씨 + 06:00~21:00 시간대별(3시간 간격) 예보
3. 어제(${yesterday}) KBO 프로야구 경기 결과(경기가 없으면 빈 배열)
4. 오늘(${today}) KBO 프로야구 예정 경기 일정(경기가 없으면 빈 배열)

JSON 스키마:
{
  "topNews": [
    {
      "rank": 1,
      "title": "헤드라인",
      "summary": "2~3문장 요약",
      "url": "https://실제기사URL"
    }
  ],
  "weather": {
    "location": "서울",
    "condition": "맑음",
    "temperature": "현재기온(예: 18°C)",
    "high": "최고기온",
    "low": "최저기온",
    "tip": "오늘 하루 한 줄 조언",
    "hourly": [
      {
        "time": "06:00",
        "condition": "맑음",
        "temperature": "15°C",
        "precipitation": "0%"
      },
      {
        "time": "09:00",
        "condition": "구름많음",
        "temperature": "18°C",
        "precipitation": "10%"
      }
    ]
  },
  "kboResults": [
    {
      "homeTeam": "홈팀",
      "awayTeam": "원정팀",
      "homeScore": 5,
      "awayScore": 3,
      "result": "5 : 3 홈팀 승"
    }
  ],
  "kboSchedule": [
    {
      "homeTeam": "홈팀",
      "awayTeam": "원정팀",
      "startTime": "18:30",
      "stadium": "구장명"
    }
  ]
}

규칙:
- topNews는 정확히 5개, rank 1~5
- url은 반드시 실제 접근 가능한 기사 원문 링크
- weather.hourly는 06:00, 09:00, 12:00, 15:00, 18:00, 21:00 총 6개 시간대
- hourly.time은 "HH:00" 형식, precipitation은 강수확률(예: "20%")
- kboSchedule.startTime은 "HH:MM" 형식(24시간), 팀명은 KBO 공식 팀명 사용
- kboSchedule은 오늘(${today}) 예정된 경기만 포함, 시작 시간 순 정렬
- 한국어로 작성
- JSON 외 다른 텍스트 금지`;
}

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced?.[1]) return fenced[1].trim();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1) return text.slice(start, end + 1);

  return text.trim();
}

export async function generateBriefing(): Promise<DailyBriefing> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY 환경변수가 설정되지 않았습니다.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const now = getKstNow();

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: buildPrompt(),
    config: {
      tools: [{ googleSearch: {} }],
      temperature: 0.3,
    },
  });

  const rawText = response.text;
  if (!rawText) {
    throw new Error("Gemini API에서 응답을 받지 못했습니다.");
  }

  let parsed: Omit<DailyBriefing, "date" | "generatedAt">;
  try {
    parsed = JSON.parse(extractJson(rawText));
  } catch {
    throw new Error(`JSON 파싱 실패: ${rawText.slice(0, 200)}`);
  }

  return {
    date: formatKstDate(now),
    generatedAt: now.toISOString(),
    topNews: parsed.topNews ?? [],
    weather: {
      location: parsed.weather?.location ?? "서울",
      condition: parsed.weather?.condition ?? "-",
      temperature: parsed.weather?.temperature ?? "-",
      high: parsed.weather?.high ?? "-",
      low: parsed.weather?.low ?? "-",
      tip: parsed.weather?.tip ?? "날씨 정보를 불러오지 못했습니다.",
      hourly: parsed.weather?.hourly ?? [],
    },
    kboResults: parsed.kboResults ?? [],
    kboSchedule: parsed.kboSchedule ?? [],
  };
}
