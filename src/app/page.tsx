import { CardNews } from "@/components/CardNews";
import { getCachedBriefing } from "@/lib/briefing";

export const revalidate = 43200;

export default async function HomePage() {
  let error: string | null = null;
  let briefing = null;

  try {
    briefing = await getCachedBriefing();
  } catch (e) {
    error = e instanceof Error ? e.message : "브리핑을 불러오지 못했습니다.";
  }

  if (error || !briefing) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <p className="text-4xl">⚠️</p>
          <h1 className="mt-4 text-xl font-bold text-slate-800">
            브리핑을 생성할 수 없습니다
          </h1>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
          <p className="mt-6 text-left text-xs leading-relaxed text-slate-400">
            Vercel 환경변수에 <code className="text-slate-600">GEMINI_API_KEY</code>를
            등록했는지 확인해 주세요.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <CardNews briefing={briefing} />
    </main>
  );
}
