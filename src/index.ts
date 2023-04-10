import express, { Response, Router } from "express";

const app = express();
app.use(express.json());

const connections: Map<String,Response> = new Map();
app.use("/api/v1",
    Router().get("/health", (req, res) => res.send("ok")),
    Router().get("/sse/:id", (req, res) => {   
        res.setHeader("Content-Type", "text/event-stream");
        const id = req.params.id;
        connections.set(id, res);
        console.log("added id " + id);
    }),
    Router().post("/trigger/:id", (req, res) => {
        const id = req.params.id;
        console.log(req.body);
        
        const message = JSON.stringify(req.body);
        notify(id, message);
        res.send("done");
    }),
    Router().post("/trigger", (req, res) => {
        console.log(req.body);
        
        connections.forEach((connection, id) => {
            notify(id, "{\"announcement\": \"global notification\"}");
        });
        res.send("done");
    }),
)
const notify = (id: String, message: String) => {
    const res = connections.get(id);
    if (res) {
        res.write(`data: ${message}\n\n`);
        console.log("notified id " + id);
    }
}

const port = 2104;

app.listen(port, () => {
    console.log(`Express listening on ${port}`);
})