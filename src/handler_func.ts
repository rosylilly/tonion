import { Context } from "./context";
import { NextFunction } from "./middleware";

export type HandlerFunc = (context: Context, next?: NextFunction) => Promise<any>;
