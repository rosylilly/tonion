import { Route } from "./route";
import { inspect } from "util";

export const NODE_TYPES = {
  STATIC: 0,
  PARAMETIC: 1,
  WILDCARD: 2,
};

export class Node {
  public type: number;
  public name: string;
  public static: { [key: string]: Node | undefined };
  public staticLength: number;
  public parametrics: { [key: string]: Node | undefined };
  public constraint: RegExp | undefined;
  public wildcard: Node | undefined;
  public handlers: { [key: string]: Route | undefined };

  constructor(type: number, name: string) {
    this.type = type;
    this.name = name;
    this.static = {};
    this.staticLength = 0;
    this.parametrics = {};
    this.wildcard = undefined;
    this.handlers = {};
  }

  public reset() {
    this.static = {};
  }

  public add(path: string, route?: Route): Node {
    const maxMatched = Object.keys(this.static).map((prefix) => {
      for (let i = 0; i < prefix.length; i++) {
        const c = prefix[i];
        if (c !== path.charAt(i)) {
          return i;
        }
      }
      return prefix.length;
    }).sort().reverse()[0] || 0;
    const pathPrefix = path.slice(0, maxMatched);
    path = path.slice(maxMatched);
    let parent = this as Node;

    if (pathPrefix.length > 0) {
      Object.keys(this.static).forEach((oldPrefix) => {
        const oldNode = this.static[oldPrefix] as Node;
        if (oldPrefix.length <= maxMatched) {
          return;
        }
        const newPrefix = oldPrefix.slice(0, pathPrefix.length);
        const newName = oldNode.name.slice(newPrefix.length);

        let newNode = this.static[newPrefix];
        if (!newNode) {
          newNode = new Node(NODE_TYPES.STATIC, newPrefix);
          this.static[newPrefix] = newNode;
        }
        oldNode.name = newName;
        newNode.static[newName] = oldNode;
        newNode.updateStaticLength();

        if (path === "" && route) {
          newNode.handlers[route.method] = route;
        }
        delete this.static[oldPrefix];
      });
      this.updateStaticLength();
      parent = this.static[pathPrefix] as Node;
      if (path.length > 0) {
        return parent.add(path, route);
      }
    }

    if (path.length === 0) {
      if (route) {
        parent.handlers[route.method] = route;
      }
      return parent;
    }

    if (parent.staticLength > 0 && path.length > parent.staticLength) {
      parent = parent.add(path.slice(0, parent.staticLength));
      path = path.slice(parent.name.length);
    }

    let node = new Node(NODE_TYPES.STATIC, path);
    if (parent.static[path]) {
      node = parent.static[path] as Node;
    }

    if (route) {
      node.handlers[route.method] = route;
    }

    parent.static[path] = node;
    parent.updateStaticLength();

    return node;
  }

  public lookup(path: string): Node | undefined {
    if (path === "") {
      return this;
    }

    const prefix = path.slice(0, this.staticLength);
    path = path.slice(this.staticLength);

    const node = this.static[prefix];
    if (node) {
      return node.lookup(path);
    }

    return this.wildcard;
  }

  public toJSON() {
    return {
      has: !!this.handlers.GET,
      name: this.name,
      static: this.static,
      parametrics: this.parametrics,
      staticLength: this.staticLength,
      wild: !!this.wildcard,
    };
  }

  public [inspect.custom]() {
    return JSON.stringify(this, undefined, 2);
  }

  private updateStaticLength() {
    this.staticLength = Object.keys(this.static).map((key) => key.length).sort().reverse()[0] || 0;
  }
}
