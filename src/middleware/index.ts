import { Context } from "../context";

export type NextFunction = (context: Context) => Promise<any>;

export abstract class Middleware {
  public abstract async call(context: Context, next: NextFunction): Promise<void>;
}
