import { type NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {  
  const pathname = request.nextUrl.pathname  
    
  if (pathname.startsWith('/ph')) {  
    const url = new URL(request.url)  
    const hostname = pathname.startsWith('/ph/static/')  
      ? 'us-assets.i.posthog.com'  
      : 'us.i.posthog.com'  
      
    const newPathname = pathname.replace(/^\/ph/, '')  
      
    const headers = new Headers(request.headers)  
    headers.set('host', hostname)  
      
    const response = await fetch(`https://${hostname}${newPathname}${url.search}`, {  
      method: request.method,  
      headers: headers,  
      body: request.body,  
      duplex: 'half',  
    } as RequestInit)  
      
    return new Response(response.body, {  
      status: response.status,  
      statusText: response.statusText,  
      headers: response.headers,  
    })  
  }  
    
  return NextResponse.next()  
}

export const config = {  
  matcher: '/ph/:path*',  
}  