import { Middleware, NextFunction } from ".";
import { IncomingMessage, ServerResponse } from "http";
import { Context } from "../context";

type ExpressNextFunction = (err?: any) => void;
type ExpressMiddlewareFunction = (req: IncomingMessage, res: ServerResponse, next: ExpressNextFunction) => void;

export class ExpressMiddleware implements Middleware {
  public fn: ExpressMiddlewareFunction;

  constructor(fn: ExpressMiddlewareFunction) {
    this.fn = fn;
  }

  public async call(context: Context, next: NextFunction) {
    const { req, res } = context;

    this.fn(req.original, res.original, (err?: any) => {
      if (err) {
        throw err;
      }

      next(context);
    });
  }
}
