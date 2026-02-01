import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Запрашиваем sitemap у бэкенда
    const response = await fetch('https://api.credium.store/sitemap.xml', {
      next: { revalidate: 3600 } // Кэшируем на 1 час
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap: ${response.status}`);
    }

    const xml = await response.text();

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error fetching sitemap:', error);
    
    // Возвращаем минимальный sitemap как fallback
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://credium.store/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new NextResponse(fallbackXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    });
  }
}