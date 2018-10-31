import assert from "assert";
import { Handler } from "../handler";
import { VERBS } from "../verbs";

export interface RouteOptions {
  constraints?: { [key: string]: RegExp };
}

export class Route {
  public method: VERBS;
  public path: string;
  public handler: Handler;
  public options: RouteOptions;

  constructor(method: VERBS, path: string, handler: Handler, options?: RouteOptions) {
    assert(path.length > 0, "Path could not be empty");
    assert(path[0] === "/" || path[0] === "*", "The first character of a path should be `/` or `*`");

    this.method = method;
    this.path = path;
    this.handler = handler;
    this.options = options || {};
  }
}
