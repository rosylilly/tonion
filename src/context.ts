import { Application } from "./application";
import { Request } from "./request";
import { Response } from "./response";
import { format } from "util";

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
  }
}
