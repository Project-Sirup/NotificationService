import express, { Response, Router } from "express";
import Controller from "./Controller";

const app = express();
app.use(express.json());

const controller = new Controller();

app.use("/api/v1",
    Router().get("/health", (req, res) => res.send("ok")),
    Router().get("/subscribe/:id", (req,res) => controller.subscribe(req,res)),
    Router().post("/trigger", (req, res) => controller.notify(req,res)),
)

//TODO: move to .env
const port = 2104;

app.listen(port, () => {
    console.log(`Express listening on ${port}`);
})