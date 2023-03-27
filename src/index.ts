import express, { Response } from "express";

const app = express();
app.use(express.json());

const connections: Map<String,Response> = new Map();

app.get("/api/v1", (req, res) => {
    res.send("ok");
});
app.get("/sse/:id", (req, res) => {   
    res.setHeader("Content-Type", "text/event-stream");
    const id = req.params.id;
    connections.set(id, res);
    console.log("added id " + id);
});
const notify = (id: String, message: String) => {
    const res = connections.get(id);
    if (res) {
        res.write(`data: ${message}\n\n`);
        console.log("notified id " + id);
    }
}
app.post("/trigger/:id", (req, res) => {
    const id = req.params.id;
    console.log(req.body);
    
    const message = JSON.stringify(req.body);
    notify(id, message);
    res.send("done");
})

app.listen(2300, () => {
    console.log("Express listening on port " + 2300);
})