import { HandlerFunc } from "./handler_func";
import { Middleware } from "./middleware";

export type Handler = HandlerFunc | Middleware;
