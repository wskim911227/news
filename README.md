# ☀️ 아침 브리핑 (Morning Briefing)

매일 **오전 9시(한국 시간)** 에 Gemini API + Google 검색으로 어제 핫이슈, 오늘 날씨, KBO 경기 결과를 **카드뉴스** 형식으로 정리하는 웹 앱입니다.

## 구성

1. **어제 핫이슈 TOP 5** — 기사 원문 URL 포함
2. **오늘 날씨** — 서울 기준
3. **KBO 경기 결과** — 어제 경기 스코어

## 기술 스택

- Next.js 15 (App Router)
- Gemini API (`gemini-2.5-flash`) + Google Search Grounding
- Vercel Cron (매일 09:00 KST)
- Tailwind CSS

## 로컬 실행

```bash
npm install
cp .env.example .env.local
# .env.local에 GEMINI_API_KEY 입력
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## Vercel 배포

### 1. GitHub에 푸시 후 Vercel 연결

> **중요:** Vercel 프로젝트 설정에서 Framework Preset이 **Next.js**인지 확인하세요.  
> Output Directory를 `public`으로 수동 설정하면 배포 오류가 납니다. (비워두거나 기본값 사용)

### 2. 환경변수 등록 (Vercel Dashboard → Settings → Environment Variables)

| 변수명 | 설명 |
|--------|------|
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/apikey)에서 발급 |
| `CRON_SECRET` | Cron 보안용 임의 문자열 (예: `openssl rand -hex 32`) |

### 3. Cron 스케줄

`vercel.json`에 설정되어 있습니다:

- **스케줄**: `0 0 * * *` (UTC 00:00 = **한국 시간 09:00**)
- **경로**: `/api/cron`

Vercel Hobby 플랜 이상에서 Cron이 동작합니다.

## API

| 엔드포인트 | 설명 |
|-----------|------|
| `GET /` | 카드뉴스 브리핑 페이지 |
| `GET /api/briefing` | JSON 형식 브리핑 데이터 |
| `GET /api/cron` | Cron 전용 (Authorization: Bearer CRON_SECRET) |

## Gemini API 키 발급

1. [Google AI Studio](https://aistudio.google.com/apikey) 접속
2. **Create API Key** 클릭
3. Vercel 환경변수 `GEMINI_API_KEY`에 등록

## Git 자동 푸시 설정

커밋할 때마다 GitHub에 자동으로 push되도록 hook을 설치합니다 (최초 1회):

```bash
npm run hooks:install
```

이후 `git commit` 시 `origin`으로 자동 푸시됩니다.

## 저장소

- GitHub: [wskim911227/news](https://github.com/wskim911227/news)
