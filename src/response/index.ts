import { ServerResponse } from "http";
import mimeTypes from "mime-types";
import { Header } from "../header";
import { ResponseDelegate } from "./delegate";

export class Response extends ResponseDelegate {
  public body: Buffer;

  constructor(original: ServerResponse) {
    super(original);
    this.body = Buffer.from("");
  }

  public get(key: string): number | string | string[] | undefined {
    return this.getHeader(key);
  }

  public set(key: string, value: number | string | string[]): void;
  public set(fields: Header): void;
  public set(fieldsOrKey: string | Header, value?: number | string | string[]) {
    if (typeof fieldsOrKey === "string") {
      if (value) { this.setHeader(fieldsOrKey, value); }
      return;
    }

    for (const key of fieldsOrKey) {
      this.setHeader(key, fieldsOrKey[key]);
    }
  }

  public remove(...keys: string[]) {
    keys.forEach((key) => {
      this.removeHeader(key);
    });
  }

  public get type(): string {
    const type = this.get("Content-Type");
    if (!type) { return ""; }

    return type.toString().split(";")[0];
  }
  public set type(type: string) {
    const lookuped = mimeTypes.lookup(type);

    if (lookuped) {
      this.set("Content-Type", lookuped);
    } else {
      this.remove("Content-Type");
    }
  }

  public set length(num: number) {
    this.set("Content-Length", num);
  }

  public send(status: number): void;
  public send(status: number, body: string, headers?: Header): void;
  public send(status: number, body: Buffer, headers?: Header): void;
  public send(status: number, body?: string | Buffer, headers?: Header) {
    if (!body) {
      body = "";
    }

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
      this.length = body.byteLength;
    }

    this.body = body;
  }
}
