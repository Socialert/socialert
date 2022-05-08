// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export default async function handler(req, res) {
    if (req.method !== 'GET') {return res.status(405).send({ error: 'method not allowed' })}
  
    // cache robots.txt for up to 60 seconds
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
    )
    res.setHeader('Content-Type', 'text/plain')
    res.write(`User-agent: *
    Sitemap: ${process.env.APP_DOMAIN}/api/sitemap.xml`)
    res.end()
  }
  