// Cloudflare Pages Function — proxies /api/* to the backend so the SPA and
// API share an origin. This lets the browser treat the backend's XSRF-TOKEN
// cookie as same-site (readable via document.cookie), which is required for
// the cookie-based CSRF flow used by Spring Security.

const BACKEND_ORIGIN = 'https://api.usw-festival.site'

// Minimal local type — avoids needing @cloudflare/workers-types as a dep.
interface PagesContext {
  request: Request
}

export async function onRequest(context: PagesContext): Promise<Response> {
  const { request } = context
  const url = new URL(request.url)
  const targetURL = BACKEND_ORIGIN + url.pathname + url.search

  const proxyRequest = new Request(targetURL, request)
  const response = await fetch(proxyRequest)

  // Set-Cookie 의 Domain 속성을 제거해 쿠키가 현재(Pages) origin 에 묶이게 만든다.
  // 이 변환을 안 하면 브라우저가 'Domain=api.usw-festival.site' 쿠키를 거부.
  const headers = new Headers(response.headers)
  const getter = (response.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie
  const setCookies = typeof getter === 'function' ? getter.call(response.headers) : []

  if (setCookies.length === 0) {
    return response
  }

  headers.delete('set-cookie')
  for (const cookie of setCookies) {
    headers.append('Set-Cookie', cookie.replace(/;\s*Domain=[^;]+/i, ''))
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
