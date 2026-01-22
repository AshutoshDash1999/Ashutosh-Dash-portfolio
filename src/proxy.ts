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
    // Remove accept-encoding to let fetch handle compression automatically  
    headers.delete('accept-encoding')  
        
    try {  
      const response = await fetch(`https://${hostname}${newPathname}${url.search}`, {    
        method: request.method,    
        headers: headers,    
        body: request.body,  
        duplex: 'half',  
      } as RequestInit)    
        
      // Create new headers from response  
      const responseHeaders = new Headers(response.headers)  
      // Remove content-encoding as we're getting raw data  
      responseHeaders.delete('content-encoding')  
          
      return new Response(response.body, {    
        status: response.status,    
        statusText: response.statusText,    
        headers: responseHeaders,    
      })  
    } catch (error) {  
      // Handle aborted requests (client disconnected)  
      if (error instanceof Error && (error.name === 'AbortError' || (error as NodeJS.ErrnoException).code === 'ECONNRESET')) {  
        return new Response(JSON.stringify({ error: 'Client closed connection' }), {   
          status: 499,  
          headers: { 'Content-Type': 'application/json' }  
        })  
      }  
      // Handle other fetch errors  
      return new Response(JSON.stringify({ error: 'Proxy request failed' }), {   
        status: 502,  
        headers: { 'Content-Type': 'application/json' }  
      })  
    }  
  }    
      
  return NextResponse.next()    
}

export const config = {    
  matcher: '/ph/:path*',    
}  