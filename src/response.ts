import { ServerResponse } from "http";
import { Header } from "./header";

export class Response {
  public original: ServerResponse;

  public body: Buffer;

  constructor(original: ServerResponse) {
    this.original = original;
    this.body = Buffer.from("");
  }

  public set(key: string, value: number | string | string[]) {
    this.original.setHeader(key, value);
  }

  public remove(key: string) {
    this.original.removeHeader(key);
  }

  public send(status: number, body: string, headers?: Header): void;
  public send(status: number, body: Buffer, headers?: Header): void;
  public send(status: number, body: string | Buffer, headers?: Header) {
    if (typeof body === "string") {
      body = Buffer.from(body);
    }

    if (headers) {
      for (const key of headers) {
        const value = headers[key];
        this.set(key, value);
      }
    }

    if (body.length === 0 && status >= 200 && status < 300) {
      status = 204;
      this.remove("Content-Length");
    } else {
      this.set("Content-Length", body.length);
    }

    this.original.write(body);
  }
}
