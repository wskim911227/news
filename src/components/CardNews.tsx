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

function spanClass(index: number, total: number) {
  const isLastOdd = total % 2 !== 0 && index === total - 1;
  return isLastOdd ? "md:col-span-2" : "";
}

export function CardNews({ briefing }: CardNewsProps) {
  const generatedLabel = formatKstDateTime(new Date(briefing.generatedAt));
  const newsCount = briefing.topNews.length;
  const kboCount = briefing.kboResults.length;
  const scheduleCount = briefing.kboSchedule.length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        {/* 커버 카드 */}
        <article className="card-news col-span-full overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl">
          <p className="text-sm font-medium tracking-widest text-slate-300 uppercase">
            Morning Briefing
          </p>
          <h1 className="mt-3 text-3xl leading-tight font-bold md:text-4xl">
            오늘의 아침 브리핑
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
            className={`card-news overflow-hidden rounded-3xl bg-gradient-to-br ${CARD_GRADIENTS[index % CARD_GRADIENTS.length]} p-6 text-white shadow-xl ${spanClass(index, newsCount)}`}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-lg font-black backdrop-blur-sm">
                {news.rank}
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                HOT ISSUE
              </span>
            </div>
            <h2 className="mt-4 text-lg leading-snug font-bold md:text-xl">
              {news.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/90 line-clamp-4">
              {news.summary}
            </p>
            {news.url && (
              <a
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex max-w-full items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-xs font-medium backdrop-blur-sm transition hover:bg-white/30"
              >
                <span>📰</span>
                <span className="truncate">기사 원문 보기</span>
                <span>→</span>
              </a>
            )}
          </article>
        ))}

        {/* 섹션: 날씨 */}
        <SectionLabel emoji="🌤️" title="오늘의 시간대별 날씨" />

        <article className="card-news overflow-hidden rounded-3xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 p-6 text-white shadow-xl md:col-span-2">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-sky-100">
                {briefing.weather.location}
              </p>
              <div className="mt-2 flex items-end gap-3">
                <p className="text-4xl font-black md:text-5xl">
                  {briefing.weather.temperature}
                </p>
                <p className="mb-1 text-lg font-semibold md:text-xl">
                  {briefing.weather.condition}
                </p>
              </div>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="rounded-lg bg-white/20 px-3 py-1.5 backdrop-blur-sm">
                최고 {briefing.weather.high}
              </span>
              <span className="rounded-lg bg-white/20 px-3 py-1.5 backdrop-blur-sm">
                최저 {briefing.weather.low}
              </span>
            </div>
          </div>

          {briefing.weather.hourly.length > 0 && (
            <div className="mt-6">
              <p className="mb-3 text-xs font-semibold tracking-wider text-sky-100 uppercase">
                시간대별 예보
              </p>
              <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {briefing.weather.hourly.map((slot) => (
                  <div
                    key={slot.time}
                    className="flex min-w-[88px] shrink-0 flex-col items-center rounded-2xl bg-white/15 px-3 py-4 backdrop-blur-sm"
                  >
                    <p className="text-xs font-semibold text-sky-100">
                      {slot.time}
                    </p>
                    <p className="mt-2 text-2xl leading-none">
                      {weatherEmoji(slot.condition)}
                    </p>
                    <p className="mt-2 text-sm font-bold">{slot.temperature}</p>
                    <p className="mt-1 text-center text-xs text-white/80">
                      {slot.condition}
                    </p>
                    {slot.precipitation && (
                      <p className="mt-1 text-xs text-sky-100">
                        💧 {slot.precipitation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="mt-5 rounded-2xl bg-white/15 p-4 text-sm leading-relaxed backdrop-blur-sm">
            💡 {briefing.weather.tip}
          </p>
        </article>

        {/* 섹션: KBO */}
        <SectionLabel emoji="⚾" title="KBO 경기 결과" />

        {kboCount === 0 ? (
          <article className="card-news col-span-full rounded-3xl bg-gradient-to-br from-slate-700 to-slate-900 p-7 text-center text-white shadow-xl">
            <p className="text-4xl">⚾</p>
            <p className="mt-3 font-medium text-slate-300">
              어제 예정된 KBO 경기가 없습니다.
            </p>
          </article>
        ) : (
          briefing.kboResults.map((game, index) => (
            <article
              key={`${game.homeTeam}-${game.awayTeam}-${index}`}
              className={`card-news overflow-hidden rounded-3xl bg-gradient-to-br from-green-700 via-emerald-600 to-teal-600 p-6 text-white shadow-xl ${spanClass(index, kboCount)}`}
            >
              <p className="text-center text-xs font-semibold tracking-widest text-emerald-100 uppercase">
                KBO Regular Season
              </p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <TeamBlock name={game.awayTeam} score={game.awayScore} />
                <span className="text-xl font-black text-white/60">VS</span>
                <TeamBlock
                  name={game.homeTeam}
                  score={game.homeScore}
                  align="right"
                />
              </div>
              <p className="mt-4 text-center text-sm font-medium text-emerald-100">
                {game.result}
              </p>
            </article>
          ))
        )}

        {/* 금일 예정 경기 */}
        <SectionLabel emoji="📅" title="금일 예정 경기" />

        {scheduleCount === 0 ? (
          <article className="card-news col-span-full rounded-3xl bg-gradient-to-br from-slate-600 to-slate-800 p-7 text-center text-white shadow-xl">
            <p className="text-4xl">📅</p>
            <p className="mt-3 font-medium text-slate-300">
              오늘 예정된 KBO 경기가 없습니다.
            </p>
          </article>
        ) : (
          <>
            <p className="col-span-full px-1 text-sm text-slate-500">
              총 {scheduleCount}경기
            </p>
            {briefing.kboSchedule.map((game, index) => (
            <article
              key={`schedule-${game.homeTeam}-${game.awayTeam}-${index}`}
              className={`card-news overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-600 p-6 text-white shadow-xl ${spanClass(index, scheduleCount)}`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold tracking-widest text-blue-100 uppercase">
                  Today&apos;s Game
                </p>
                <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold backdrop-blur-sm">
                  {game.startTime}
                </span>
              </div>
              <div className="mt-5 flex items-center justify-between gap-3">
                <ScheduledTeamBlock name={game.awayTeam} label="원정" />
                <span className="text-xl font-black text-white/60">VS</span>
                <ScheduledTeamBlock
                  name={game.homeTeam}
                  label="홈"
                  align="right"
                />
              </div>
              {game.stadium && (
                <p className="mt-4 text-center text-sm text-blue-100">
                  📍 {game.stadium}
                </p>
              )}
            </article>
            ))}
          </>
        )}

        {/* 푸터 카드 */}
        <article className="card-news col-span-full rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-lg">
          <p className="text-sm text-slate-500">
            Powered by Gemini + Google Search
          </p>
          <p className="mt-1 text-xs text-slate-400">
            매일 오전 9시 자동 업데이트
          </p>
        </article>
      </div>
    </div>
  );
}

function weatherEmoji(condition: string): string {
  if (/맑|쾌청|화창/.test(condition)) return "☀️";
  if (/구름|흐림/.test(condition)) return "⛅";
  if (/비|소나기|이슬비/.test(condition)) return "🌧️";
  if (/눈/.test(condition)) return "❄️";
  if (/천둥|번개/.test(condition)) return "⛈️";
  if (/안개|박무/.test(condition)) return "🌫️";
  return "🌤️";
}

function SectionLabel({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div className="col-span-full flex items-center gap-2 px-1 pt-2">
      <span className="text-xl">{emoji}</span>
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
    </div>
  );
}

function ScheduledTeamBlock({
  name,
  label,
  align = "left",
}: {
  name: string;
  label: string;
  align?: "left" | "right";
}) {
  return (
    <div className={`min-w-0 flex-1 ${align === "right" ? "text-right" : "text-left"}`}>
      <p className="text-xs font-medium text-blue-200">{label}</p>
      <p className="mt-1 truncate text-lg font-bold md:text-xl">{name}</p>
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
    <div className={`min-w-0 flex-1 ${align === "right" ? "text-right" : "text-left"}`}>
      <p className="truncate text-sm font-medium text-emerald-100">{name}</p>
      <p className="mt-1 text-3xl font-black md:text-4xl">{score}</p>
    </div>
  );
}
