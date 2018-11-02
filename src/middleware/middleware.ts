import { Context } from "../context";
import { NextFunction } from "./next_function";

export abstract class Middleware {
  public abstract async call(context: Context, next: NextFunction): Promise<void>;
}
