import { IncomingMessage } from "http";
import { TLSSocket } from "tls";
import { URL } from "url";
import { RequestDelegate } from "./delegate";

export class Request extends RequestDelegate {
  constructor(original: IncomingMessage) {
    super(original);
  }

  public get protocol(): string {
    if (this.socket instanceof TLSSocket && this.socket.encrypted) { return "https"; }
    const proto = this.get("X-Forwarded-Proto");
    return proto.split(/\s*,\s*/)[0] || "http";
  }

  public get host(): string {
    let host = this.get("X-Forwarded-Host");
    if (!host) {
      if (this.httpVersionMajor >= 2) { host = this.get(":authority"); }
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

  public get(key: string): string {
    key = key.toLowerCase();

    const value = this.headers[key];
    if (value instanceof Array) {
      return value.join(", ");
    }
    return value || "";
  }
}
