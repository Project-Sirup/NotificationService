import cors from "cors";
import express, { urlencoded, Router } from "express";
import Controller from "./Controller";

const app = express();
app
.use(express.json())
.use(urlencoded({ extended: true}))
.use(cors());

const controller = new Controller();

app.use("/api/v1",
    Router().get("/health", (req, res) => res.send("ok")),
    Router().get("/subscribe/:id", (req,res) => controller.subscribe(req,res)),
    Router().post("/trigger", (req, res) => controller.notify(req,res)),
)

//TODO: move to .env
const port = process.env.NOTI_PORT;

app.listen(port, () => {
    console.log(`Express listening on ${port}`);
})