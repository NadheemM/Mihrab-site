import gplay from 'google-play-scraper';

export const runtime = 'nodejs';
export const revalidate = 86400; // re-fetch once per day

function formatDownloads(n: number): string {
  if (n >= 1_000_000) return `${Math.floor(n / 1_000_000)}M+`;
  if (n >= 1_000)     return `${Math.floor(n / 1_000)}K+`;
  return String(n);
}

export async function GET() {
  try {
    const app = await (gplay as unknown as { app: (o: object) => Promise<{
      score: number;
      ratings: number;
      maxInstalls: number;
    }> }).app({ appId: 'in.mihrab.app' });

    return Response.json({
      rating:    app.score.toFixed(1),          // "4.8"
      downloads: formatDownloads(app.maxInstalls), // "50K+"
      reviews:   app.ratings > 1000
        ? `${(app.ratings / 1000).toFixed(1)}K`
        : String(app.ratings),
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600' },
    });
  } catch {
    // Fallback — hardcoded from last known values
    return Response.json({
      rating:    '4.8',
      downloads: '50K+',
      reviews:   '2K+',
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600' },
    });
  }
}
