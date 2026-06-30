const basicAuth = "Basic " + btoa("1:password1");

export default {
    async fetch(request, env) {
        // Basic Auth
        const authHeader = request.headers.get("Authorization");

        if (authHeader !== basicAuth) {
            return new Response("Unauthorized", {
                status: 401,
                headers: {
                    "WWW-Authenticate": 'Basic realm="Restricted"',
                },
            });
        }

        return env.ASSETS.fetch(request);
    },
};