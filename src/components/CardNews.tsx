import type { DailyBriefing } from "@/lib/types";
import { formatKstDateTime } from "@/lib/date";

interface CardNewsProps {
  briefing: DailyBriefing;
}

const CARD_GRADIENTS = [
  "from-rose-500 via-pink-500 to-orange-400",
  "from-violet-600 via-purple-500 to-fuchsia-500",
  "from-blue-600 via-indigo-500 to-cyan-400",
  "from-emerald-500 via-teal-500 to-green-400",
  "from-amber-500 via-orange-500 to-red-400",
];

export function CardNews({ briefing }: CardNewsProps) {
  const generatedLabel = formatKstDateTime(new Date(briefing.generatedAt));

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-10">
      {/* 커버 카드 */}
      <article className="card-news overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl">
        <p className="text-sm font-medium tracking-widest text-slate-300 uppercase">
          Morning Briefing
        </p>
        <h1 className="mt-3 text-3xl leading-tight font-bold">
          오늘의
          <br />
          아침 브리핑
        </h1>
        <p className="mt-4 text-lg text-slate-200">{briefing.date}</p>
        <p className="mt-6 text-xs text-slate-400">
          매일 오전 9시 업데이트 · {generatedLabel} 생성
        </p>
      </article>

      {/* 섹션: TOP 5 뉴스 */}
      <SectionLabel emoji="🔥" title="어제 핫이슈 TOP 5" />

      {briefing.topNews.map((news, index) => (
        <article
          key={news.rank}
          className={`card-news overflow-hidden rounded-3xl bg-gradient-to-br ${CARD_GRADIENTS[index % CARD_GRADIENTS.length]} p-7 text-white shadow-xl`}
        >
          <div className="flex items-start justify-between gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-xl font-black backdrop-blur-sm">
              {news.rank}
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
              HOT ISSUE
            </span>
          </div>
          <h2 className="mt-5 text-xl leading-snug font-bold">{news.title}</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/90">
            {news.summary}
          </p>
          {news.url && (
            <a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-xs font-medium backdrop-blur-sm transition hover:bg-white/30"
            >
              <span>📰</span>
              <span className="max-w-[220px] truncate">기사 원문 보기</span>
              <span>→</span>
            </a>
          )}
        </article>
      ))}

      {/* 섹션: 날씨 */}
      <SectionLabel emoji="🌤️" title="오늘의 날씨" />

      <article className="card-news overflow-hidden rounded-3xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 p-7 text-white shadow-xl">
        <p className="text-sm font-medium text-sky-100">
          {briefing.weather.location}
        </p>
        <div className="mt-2 flex items-end gap-3">
          <p className="text-5xl font-black">{briefing.weather.temperature}</p>
          <p className="mb-2 text-xl font-semibold">
            {briefing.weather.condition}
          </p>
        </div>
        <div className="mt-4 flex gap-4 text-sm">
          <span className="rounded-lg bg-white/20 px-3 py-1.5 backdrop-blur-sm">
            최고 {briefing.weather.high}
          </span>
          <span className="rounded-lg bg-white/20 px-3 py-1.5 backdrop-blur-sm">
            최저 {briefing.weather.low}
          </span>
        </div>
        <p className="mt-5 rounded-2xl bg-white/15 p-4 text-sm leading-relaxed backdrop-blur-sm">
          💡 {briefing.weather.tip}
        </p>
      </article>

      {/* 섹션: KBO */}
      <SectionLabel emoji="⚾" title="KBO 경기 결과" />

      {briefing.kboResults.length === 0 ? (
        <article className="card-news rounded-3xl bg-gradient-to-br from-slate-700 to-slate-900 p-7 text-center text-white shadow-xl">
          <p className="text-4xl">⚾</p>
          <p className="mt-3 font-medium text-slate-300">
            어제 예정된 KBO 경기가 없습니다.
          </p>
        </article>
      ) : (
        briefing.kboResults.map((game, index) => (
          <article
            key={`${game.homeTeam}-${game.awayTeam}-${index}`}
            className="card-news overflow-hidden rounded-3xl bg-gradient-to-br from-green-700 via-emerald-600 to-teal-600 p-7 text-white shadow-xl"
          >
            <p className="text-center text-xs font-semibold tracking-widest text-emerald-100 uppercase">
              KBO Regular Season
            </p>
            <div className="mt-5 flex items-center justify-between gap-4">
              <TeamBlock name={game.awayTeam} score={game.awayScore} />
              <span className="text-2xl font-black text-white/60">VS</span>
              <TeamBlock name={game.homeTeam} score={game.homeScore} align="right" />
            </div>
            <p className="mt-5 text-center text-sm font-medium text-emerald-100">
              {game.result}
            </p>
          </article>
        ))
      )}

      {/* 푸터 카드 */}
      <article className="card-news rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-lg">
        <p className="text-sm text-slate-500">
          Powered by Gemini + Google Search
        </p>
        <p className="mt-1 text-xs text-slate-400">
          매일 오전 9시 자동 업데이트
        </p>
      </article>
    </div>
  );
}

function SectionLabel({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div className="flex items-center gap-2 px-1">
      <span className="text-xl">{emoji}</span>
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
    </div>
  );
}

function TeamBlock({
  name,
  score,
  align = "left",
}: {
  name: string;
  score: number;
  align?: "left" | "right";
}) {
  return (
    <div className={`flex-1 ${align === "right" ? "text-right" : "text-left"}`}>
      <p className="text-sm font-medium text-emerald-100">{name}</p>
      <p className="mt-1 text-4xl font-black">{score}</p>
    </div>
  );
}
