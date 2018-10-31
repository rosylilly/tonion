import { IncomingMessage, IncomingHttpHeaders } from "http";
import { Socket } from "net";
import { TLSSocket } from "tls";
import { URL } from "url";

export class Request {
  public original: IncomingMessage;

  constructor(original: IncomingMessage) {
    this.original = original;
  }

  public get socket(): Socket | TLSSocket {
    return this.original.socket;
  }

  public get method(): string {
    return this.original.method || "";
  }

  public get headers(): IncomingHttpHeaders {
    return this.original.headers;
  }

  public get url(): string {
    return this.original.url || "";
  }

  public get protocol(): string {
    if (this.socket instanceof TLSSocket && this.socket.encrypted) { return "https"; }
    const proto = this.get("X-Forwarded-Proto");
    return proto.split(/\s*,\s*/)[0] || "http";
  }

  public get host(): string {
    let host = this.get("X-Forwarded-Host");
    if (!host) {
      if (this.original.httpVersionMajor >= 2) { host = this.get(":authority"); }
      if (!host) { host = this.get("Host"); }
    }
    if (!host) { return ""; }
    return host.split(/\s*,\s*/)[0];
  }

  public get hostname(): string {
    const host = this.host;
    return host.split(":")[0] || "";
  }

  public get URL(): URL | undefined {
    try {
      return new URL(`${this.protocol}://${this.host}${this.url}`);
    } catch (error) {
      return undefined;
    }
  }

  public get(field: string): string {
    field = field.toLowerCase();

    const value = this.headers[field];
    if (value instanceof Array) {
      return value.join(", ");
    }
    return value || "";
  }
}
