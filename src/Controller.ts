import {Request, Response} from "express";

export default class Controller {

    private connections: Map<String,Response> = new Map();
    private globalMessage: string = undefined;

    subscribe(req: Request, res: Response) {
        res.setHeader("Content-Type", "text/event-stream");
        const id = req.params.id;
        this.connections.set(id, res);
        if (this.globalMessage) {
            this._notify(id, this.globalMessage);
        }
        console.log("added id " + id);
    }

    notify(req: Request, res: Response) {
        const event: Event = req.body;
        if(event.eventType === "invite") {
            const id = event.id;
            console.log(req.body);

            const payload = {
                type: "invite",
                data: event.data,
            };
            const message = JSON.stringify(payload);
            this._notify(id, message);
            res.send("done");
            return;
        }
        if(event.eventType === "global") {
            console.log(req.body);
            const message = JSON.stringify(event);
            this.globalMessage = message;
            this.connections.forEach((connection, id) => {
                this._notify(id, message);
            });
            res.send("done");
            return;
        }
        if(event.eventType === "other") {
            if(event.message === "clear") {
                this.globalMessage = undefined;
                res.send("done");
            }
        }
    }

    private _notify = (id: String, message: String) => {
        const res = this.connections.get(id);
        if (res) {
            res.write(`data: ${message}\n\n`);
            console.log("notified id " + id);
        }
    }
}

export type EventType = "invite" | "global" | "other";

export type Event = {
    eventType: EventType;
    id: string;
    message: string;
    data: object;
}