import { Application } from "./application";
import { Request } from "./request";
import { Response } from "./response";
import { format } from "util";
import statuses from "statuses";

export class Context {
  public app: Application;
  public request: Request;
  public response: Response;
  public params: { [key: string]: string | undefined } = {};

  constructor(app: Application, req: Request, res: Response) {
    this.app = app;
    this.request = req;
    this.response = res;
  }

  public get req(): Request { return this.request; }
  public get res(): Response { return this.response; }

  public onError(error?: any) {
    if (!error) { return; }

    if (!(error instanceof Error)) {
      error = new Error(format("Error: %j", error));
    }
    const { res } = this;

    if (res.headersSent) { return; }

    res.getHeaderNames().forEach((key) => {
      res.remove(key);
    });

    res.type = "text";
    if (error.headers) { res.set(error.headers); }

    if (error.code === "ENOENT") { error.status = 404; }
    if (typeof error.status !== "number" || !statuses[error.status]) { error.status = 500; }

    const statusMessage = statuses[error.status];
    const message = error.expose ?  error.message : statusMessage;
    res.statusCode = error.status;
    res.length = Buffer.byteLength(message);
    res.end(message);
  }
}
