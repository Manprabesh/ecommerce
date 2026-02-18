const clients = new Set();

export function sseHandler(req, res) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.flushHeaders();

    clients.add(res);
    console.log("clients --->", clients)

    req.on("close", () => {
        console.log("clients closed")
        clients.delete(res);
    });
}

export function sendSSE(event, data) {
    for (const client of clients) {
        console.log("clinetsss --->",client)
        client.write(`event: ${event}\n`);
        client.write(`data: ${JSON.stringify(data)}\n\n`);
    }
}
