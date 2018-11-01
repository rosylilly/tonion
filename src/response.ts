import { ServerResponse, OutgoingHttpHeaders } from "http";
import { Header } from "./header";
import { Socket } from "net";
import { Readable } from "stream";

type CallbackHandler = () => void;
type ErrorHandler = (error: Error | null | undefined) => void;

export class Response implements ServerResponse {
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

  // Server Response
  public get statusCode(): number { return this.original.statusCode; }
  public set statusCode(val: number) { this.original.statusCode = val; }
  public get statusMessage(): string { return this.original.statusMessage; }
  public set statusMessage(val: string) { this.original.statusMessage = val; }

  public assignSocket(socket: Socket) { this.original.assignSocket(socket); }
  public detachSocket(socket: Socket) { this.original.detachSocket(socket); }
  public writeContinue(cb?: CallbackHandler) { this.original.writeContinue(cb); }

  // Writable Stream
  public get writable(): boolean { return this.original.writable; }
  public get writableHighWaterMark(): number { return this.original.writableHighWaterMark; }
  public get writableLength(): number { return this.original.writableLength; }

  public _write(chunk: any, encoding: string, callback: (error?: Error | null) => void): void {
    this.original._write(chunk, encoding, callback);
  }
  public _destroy(error: Error | null, callback: (error: Error | null) => void): void {
    this.original._destroy(error, callback);
  }
  public _final(callback: (error?: Error | null) => void): void {
    this.original._final(callback);
  }
  public writeHead(
    statusCode: number,
    reasonPhrase?: string | OutgoingHttpHeaders,
    headers?: OutgoingHttpHeaders,
  ) {
    if (typeof reasonPhrase === "string") {
      this.original.writeHead(statusCode, reasonPhrase, headers);
    } else {
      this.original.writeHead(statusCode, reasonPhrase);
    }
  }
  public write(chunk: any, encoding?: ErrorHandler | string, cb?: ErrorHandler): boolean {
    if ("string" === typeof encoding) {
      return this.original.write(chunk, encoding, cb);
    } else {
      return this.original.write(chunk, cb);
    }
  }
  public setDefaultEncoding(encoding: string): this { this.original.setDefaultEncoding(encoding); return this; }
  public end(
    srcOrCallback: string | Buffer | CallbackHandler | undefined,
    encodingOrCallback?: string | CallbackHandler,
    cb?: CallbackHandler,
  ): void {
    if (typeof encodingOrCallback === "string") {
      return this.original.end(srcOrCallback, encodingOrCallback, cb);
    } else {
      return this.original.end(srcOrCallback, encodingOrCallback);
    }
  }
  public cork(): void { this.original.cork(); }
  public uncork(): void { this.original.uncork(); }
  public destroy(error?: Error): void { this.original.destroy(error); }

  // Outgoing Message
  public get upgrading(): boolean { return this.original.upgrading; }
  public set upgrading(val: boolean) { this.original.upgrading = val; }
  public get chunkedEncoding(): boolean { return this.original.chunkedEncoding; }
  public set chunkedEncoding(val: boolean) { this.original.chunkedEncoding = val; }
  public get shouldKeepAlive(): boolean { return this.original.shouldKeepAlive; }
  public set shouldKeepAlive(val: boolean) { this.original.shouldKeepAlive = val; }
  public get useChunkedEncodingByDefault(): boolean { return this.original.useChunkedEncodingByDefault ; }
  public set useChunkedEncodingByDefault(val: boolean) { this.original.useChunkedEncodingByDefault = val; }
  public get sendDate(): boolean { return this.original.sendDate; }
  public set sendDate(val: boolean) { this.original.sendDate = val; }
  public get finished(): boolean { return this.original.finished; }
  public get headersSent(): boolean { return this.original.headersSent; }
  public get connection(): Socket { return this.original.connection; }

  public setTimeout(msec: number, cb?: CallbackHandler): this { this.original.setTimeout(msec, cb); return this; }
  public setHeader(key: string, value: number | string | string[]) { this.original.setHeader(key, value); }
  public getHeader(name: string): number | string | string[] | undefined { return this.original.getHeader(name); }
  public getHeaders(): OutgoingHttpHeaders { return this.getHeaders(); }
  public getHeaderNames(): string[] { return this.original.getHeaderNames(); }
  public hasHeader(name: string): boolean { return this.original.hasHeader(name); }
  public removeHeader(name: string): void { this.original.removeHeader(name); }
  public addTrailers(headers: OutgoingHttpHeaders | Array<[string, string]>): void {
    this.original.addTrailers(headers);
  }
  public flushHeaders(): void { this.original.flushHeaders(); }

  // Stream
  public pipe<T extends NodeJS.WritableStream>(destination: T, options?: { end?: boolean; }): T {
    return this.original.pipe<T>(destination, options);
  }

  // Event Emitter
  public addListener(event: "close", listener: () => void): this;
  public addListener(event: "drain", listener: () => void): this;
  public addListener(event: "error", listener: (err: Error) => void): this;
  public addListener(event: "finish", listener: () => void): this;
  public addListener(event: "pipe", listener: (src: Readable) => void): this;
  public addListener(event: "unpipe", listener: (src: Readable) => void): this;
  public addListener(event: string | symbol, listener: (...args: any[]) => void): this {
    this.original.addListener(event, listener);
    return this;
  }
  public on(event: "close", listener: () => void): this;
  public on(event: "drain", listener: () => void): this;
  public on(event: "error", listener: (err: Error) => void): this;
  public on(event: "finish", listener: () => void): this;
  public on(event: "pipe", listener: (src: Readable) => void): this;
  public on(event: "unpipe", listener: (src: Readable) => void): this;
  public on(event: string | symbol, listener: (...args: any[]) => void): this {
    this.original.on(event, listener);
    return this;
  }
  public once(event: "close", listener: () => void): this;
  public once(event: "drain", listener: () => void): this;
  public once(event: "error", listener: (err: Error) => void): this;
  public once(event: "finish", listener: () => void): this;
  public once(event: "pipe", listener: (src: Readable) => void): this;
  public once(event: "unpipe", listener: (src: Readable) => void): this;
  public once(event: string | symbol, listener: (...args: any[]) => void): this {
    this.original.once(event, listener);
    return this;
  }
  public prependListener(event: "close", listener: () => void): this;
  public prependListener(event: "drain", listener: () => void): this;
  public prependListener(event: "error", listener: (err: Error) => void): this;
  public prependListener(event: "finish", listener: () => void): this;
  public prependListener(event: "pipe", listener: (src: Readable) => void): this;
  public prependListener(event: "unpipe", listener: (src: Readable) => void): this;
  public prependListener(event: string | symbol, listener: (...args: any[]) => void): this {
    this.original.prependListener(event, listener);
    return this;
  }
  public prependOnceListener(event: "close", listener: () => void): this;
  public prependOnceListener(event: "drain", listener: () => void): this;
  public prependOnceListener(event: "error", listener: (err: Error) => void): this;
  public prependOnceListener(event: "finish", listener: () => void): this;
  public prependOnceListener(event: "pipe", listener: (src: Readable) => void): this;
  public prependOnceListener(event: "unpipe", listener: (src: Readable) => void): this;
  public prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this {
    this.original.prependOnceListener(event, listener);
    return this;
  }
  public removeListener(event: "close", listener: () => void): this;
  public removeListener(event: "drain", listener: () => void): this;
  public removeListener(event: "error", listener: (err: Error) => void): this;
  public removeListener(event: "finish", listener: () => void): this;
  public removeListener(event: "pipe", listener: (src: Readable) => void): this;
  public removeListener(event: "unpipe", listener: (src: Readable) => void): this;
  public removeListener(event: string | symbol, listener: (...args: any[]) => void): this {
    this.original.removeListener(event, listener);
    return this;
  }
  public off(event: "close", listener: () => void): this;
  public off(event: "drain", listener: () => void): this;
  public off(event: "error", listener: (err: Error) => void): this;
  public off(event: "finish", listener: () => void): this;
  public off(event: "pipe", listener: (src: Readable) => void): this;
  public off(event: "unpipe", listener: (src: Readable) => void): this;
  public off(event: string | symbol, listener: (...args: any[]) => void): this {
    this.original.off(event, listener);
    return this;
  }
  public removeAllListeners(): this {
    this.original.removeAllListeners();
    return this;
  }

  public setMaxListeners(n: number): this { this.original.setMaxListeners(n); return this; }
  public getMaxListeners(): number { return this.original.getMaxListeners(); }
  public listeners(event: string | symbol): Function[] { return this.original.listeners(event); }
  public rawListeners(event: string | symbol): Function[] { return this.original.rawListeners(event); }
  public emit(event: "close"): boolean;
  public emit(event: "drain"): boolean;
  public emit(event: "error", err: Error): boolean;
  public emit(event: "finish"): boolean;
  public emit(event: "pipe", src: Readable): boolean;
  public emit(event: "unpipe", src: Readable): boolean;
  public emit(event: string | symbol, ...args: any[]): boolean {
    return this.original.emit(event, ...args);
  }
  public eventNames(): Array<string | symbol> { return this.original.eventNames(); }
  public listenerCount(type: string | symbol): number { return this.original.listenerCount(type); }
}
