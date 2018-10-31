import { VERBS } from "../verbs";
import { Handler } from "../handler";
import { RouteOptions } from "./route";
import { Router } from ".";

export abstract class RouteDelegate {
  public abstract router: Router;

  public match(method: VERBS, path: string, handler: Handler, options: RouteOptions = {}): void {
    this.router.match(method, path, handler, options);
  }

  public get(path: string, handler: Handler, options: RouteOptions = {}): void {
    this.router.get(path, handler, options);
  }

  public post(path: string, handler: Handler, options: RouteOptions = {}): void {
    this.router.post(path, handler, options);
  }

  public put(path: string, handler: Handler, options: RouteOptions = {}): void {
    this.router.put(path, handler, options);
  }

  public patch(path: string, handler: Handler, options: RouteOptions = {}): void {
    this.router.patch(path, handler, options);
  }

  public delete(path: string, handler: Handler, options: RouteOptions = {}): void {
    this.router.delete(path, handler, options);
  }

  public head(path: string, handler: Handler, options: RouteOptions = {}): void {
    this.router.head(path, handler, options);
  }

  public options(path: string, handler: Handler, options: RouteOptions = {}): void {
    this.router.options(path, handler, options);
  }
}
