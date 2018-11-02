import { Context } from "../context";
import { Middleware, NextFunction } from "../middleware";
import { VERBS } from "../verbs";
import { Handler } from "../handler";
import { Route, RouteOptions } from "./route";
import { Node, NODE_TYPES } from "./node";
import { HandlerFunc } from "../handler_func";

const NORMAL_PARAM_OPEN = "<";
const NORMAL_PARAM_CLOSE = ">";
const WILDCARD_PARAM = "*";

export class Router implements Middleware {
  public caseSensitive: boolean = false;
  public ignoreTrailingSlash: boolean = true;
  public maxParamLength: number = 100;
  public constrains: { [key: string]: RegExp | undefined } = {};
  public root: Node = new Node(NODE_TYPES.STATIC, "");
  public routes: Route[] = [];
  public notFound?: HandlerFunc = undefined;

  public async call(context: Context, next: NextFunction) {
    const { req } = context;
    const URL = req.URL;
    let path = "";
    if (URL) {
      path = URL.pathname;
    }

    const handler = this.resolve(req.method || "", path, context);
    if (handler instanceof Middleware) {
      return await handler.call(context, next);
    } else if (handler) {
      return await handler(context, next);
    }

    if (this.notFound) {
      await this.notFound(context, next);
    } else {
      await next(context);
    }
  }

  public reset() {
    this.root = new Node(NODE_TYPES.STATIC, "");
    this.routes = [];
  }

  public match(method: VERBS, path: string, handler: Handler, options: RouteOptions = {}): void {
    this.push(method, path, handler, options);

    if (this.ignoreTrailingSlash && path !== "/" && path[0] !== "*") {
      if (path.endsWith("/")) {
        this.push(method, path.slice(0, -1), handler, options);
      } else {
        this.push(method, path + "/", handler, options);
      }
    }
  }

  public get(path: string, handler: Handler, options: RouteOptions = {}): void {
    this.match("GET", path, handler, options);
  }
  public post(path: string, handler: Handler, options: RouteOptions = {}): void {
    this.match("POST", path, handler, options);
  }
  public put(path: string, handler: Handler, options: RouteOptions = {}): void {
    this.match("PUT", path, handler, options);
  }
  public patch(path: string, handler: Handler, options: RouteOptions = {}): void {
    this.match("PATCH", path, handler, options);
  }
  public delete(path: string, handler: Handler, options: RouteOptions = {}): void {
    this.match("DELETE", path, handler, options);
  }
  public head(path: string, handler: Handler, options: RouteOptions = {}): void {
    this.match("HEAD", path, handler, options);
  }
  public options(path: string, handler: Handler, options: RouteOptions = {}): void {
    this.match("OPTIONS", path, handler, options);
  }

  private push(method: VERBS, path: string, handler: Handler, options: RouteOptions) {
    const route = new Route(method, path, handler, options);

    if (handler instanceof Router) {
      if (!handler.notFound && this.notFound) {
        handler.notFound = this.notFound;
      }
    }

    this.addRoute(route);
  }

  private addRoute(route: Route) {
    this.routes.push(route);

    let node = this.root;
    let path = route.path;
    let staticPath = "";

    for (let i = 0, length = path.length; i < length; i++) {
      switch (path.charAt(i)) {
        case NORMAL_PARAM_OPEN:
          staticPath = path.slice(0, i);
          if (staticPath.length > 0) {
            if (this.caseSensitive) {
              staticPath = staticPath.toLowerCase();
            }

            node = node.add(staticPath);
          }

          path = path.slice(i + 1);
          const j = path.indexOf(NORMAL_PARAM_CLOSE);

          const paramName = path.slice(0, j);
          let parameticNode = new Node(NODE_TYPES.PARAMETIC, paramName);
          if (node.parametrics[paramName]) {
            parameticNode = node.parametrics[paramName] as Node;
          }

          if (route.options.constraints) {
            parameticNode.constraint = (route.options.constraints || {})[paramName];
          }

          if (!parameticNode.constraint && this.constrains[paramName]) {
            parameticNode.constraint = this.constrains[paramName];
          }
          node.parametrics[paramName] = parameticNode;
          node = parameticNode;

          path = path.slice(j + 1);
          i = 0;
          length = path.length;

          break;
        case WILDCARD_PARAM:
          staticPath = path.slice(0, i);
          if (staticPath.length > 0) {
            if (this.caseSensitive) {
              staticPath = staticPath.toLowerCase();
            }

            node = node.add(staticPath);
          }

          const wildcardName = path.slice(i + 1);
          if (!node.wildcard) {
            node.wildcard = new Node(NODE_TYPES.WILDCARD, wildcardName);
          }
          node.wildcard.handlers[route.method] = route;
          return;
      }
    }

    node.add(path, route);
  }

  private resolve(method: string, path: string, ctx: Context, root: Node = this.root): Handler | undefined {
    let node: Node | undefined = root;
    let wildcardNode: Node | undefined;
    while (node) {
      if (node.wildcard) {
        wildcardNode = node.wildcard;
      }

      if (node.type === NODE_TYPES.PARAMETIC) {
        let paramValue = "";
        if (node.constraint) {
          const constraintMatch = path.match(node.constraint);
          if (!constraintMatch) { continue; }
          paramValue = constraintMatch[0];
        } else {
          const slashIndex = path.indexOf("/");
          if (slashIndex === -1) {
            paramValue = path;
          } else {
            paramValue = path.slice(0, slashIndex);
          }
        }

        if (paramValue.length === 0 || paramValue.length > this.maxParamLength) {
          return undefined;
        }

        path = path.slice(paramValue.length);
        ctx.params[node.name] = paramValue;

        if (path === "") {
          const route = node.handlers[method];
          if (route) {
            return route.handler;
          }
        } else {
          let nodePrefix = path.slice(0, node.staticLength);
          if (!this.caseSensitive) {
            nodePrefix = nodePrefix.toLowerCase();
          }
          path = path.slice(nodePrefix.length);
          node = node.static[nodePrefix];
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        wildcardNode = node;
        node = undefined;
        break;
      }

      if (!node) {
        break;
      }

      let prefix = path.slice(0, node.staticLength);
      if (!this.caseSensitive) {
        prefix = prefix.toLowerCase();
      }

      const prefixedNode: Node | undefined = node.static[prefix];
      if (prefixedNode) {
        path = path.slice(node.staticLength);
        node = prefixedNode;
        continue;
      } else if (path === "") {
        const route = node.handlers[method];
        if (route) {
          return route.handler;
        }
        node = undefined;
        break;
      }

      for (const name in node.parametrics) {
        if (node.parametrics.hasOwnProperty(name)) {
          const parameticNode = node.parametrics[name] as Node;

          const parameticHandler = this.resolve(method, path, ctx, parameticNode);
          if (parameticHandler) {
            return parameticHandler;
          } else {
            delete ctx.params[parameticNode.name];
          }
        }
      }

      node = undefined;
    }

    if (wildcardNode) {
      const route = wildcardNode.handlers[method];
      if (route) {
        ctx.params[wildcardNode.name] = path;
        return route.handler;
      }
    }

    return undefined;
  }
}
