const KST = "Asia/Seoul";

export function getKstNow(): Date {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: KST })
  );
}

export function formatKstDate(date: Date): string {
  return date.toLocaleDateString("ko-KR", {
    timeZone: KST,
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

export function formatKstDateTime(date: Date): string {
  return date.toLocaleString("ko-KR", {
    timeZone: KST,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getYesterdayLabel(date: Date): string {
  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toLocaleDateString("ko-KR", {
    timeZone: KST,
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
