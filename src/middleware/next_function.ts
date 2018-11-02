import { Context } from "../context";

export type NextFunction = (context: Context) => Promise<any>;
