addEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    const url = new URL(request.url)
    const targetUrl = url.searchParams.get("url")

    // Handle CORS Preflight Requests
    if (request.method === "OPTIONS") {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers") || "*",
                "Access-Control-Max-Age": "86400",
            }
        })
    }

    if (!targetUrl) {
        return new Response("Missing 'url' query parameter. Example: ?url=https://api.openai.com/v1/models", { status: 400 })
    }

    // Rewrite the request to target the actual API
    const newRequest = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: "follow",
    })

    // Forward the request and attach CORS headers to the response
    try {
        const response = await fetch(newRequest)
        const newResponse = new Response(response.body, response)

        newResponse.headers.set("Access-Control-Allow-Origin", "*")
        newResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        newResponse.headers.set("Access-Control-Allow-Headers", "*")

        return newResponse
    } catch (err) {
        return new Response(`Proxy Error: ${err.message}`, { status: 500 })
    }
}
