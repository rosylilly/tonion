import { IncomingMessage, IncomingHttpHeaders } from "http";
import { Socket } from "net";

export abstract class RequestDelegate implements IncomingMessage {
  constructor(public original: IncomingMessage) {
  }

  // IncomingMessage
  public get httpVersion(): string { return this.original.httpVersion; }
  public set httpVersion(val: string) { this.original.httpVersion = val; }
  public get httpVersionMajor(): number { return this.original.httpVersionMajor; }
  public set httpVersionMajor(val: number) { this.original.httpVersionMajor = val; }
  public get httpVersionMinor(): number { return this.original.httpVersionMinor; }
  public set httpVersionMinor(val: number) { this.original.httpVersionMinor = val; }
  public get connection(): Socket { return this.original.connection; }
  public set connection(val: Socket) { this.original.connection = val; }
  public get headers(): IncomingHttpHeaders { return this.original.headers; }
  public set headers(val: IncomingHttpHeaders) { this.original.headers = val; }
  public get rawHeaders(): string[] { return this.original.rawHeaders; }
  public set rawHeaders(val: string[]) { this.original.rawHeaders = val; }
  public get trailers(): { [key: string]: string | undefined } { return this.original.trailers; }
  public set trailers(val: { [key: string]: string | undefined }) { this.original.trailers = val; }
  public get rawTrailers(): string[] { return this.original.rawTrailers; }
  public set rawTrailers(val: string[]) { this.original.rawTrailers = val; }
  public get method(): string | undefined { return this.original.method; }
  public set method(val: string | undefined) { this.original.method = val; }
  public get url(): string | undefined { return this.original.url; }
  public set url(val: string | undefined) { this.original.url = val; }
  public get statusCode(): number | undefined { return this.original.statusCode; }
  public set statusCode(val: number | undefined) { this.original.statusCode = val; }
  public get statusMessage(): string | undefined { return this.original.statusMessage; }
  public set statusMessage(val: string | undefined) { this.original.statusMessage = val; }
  public get socket(): Socket { return this.original.socket; }
  public set socket(val: Socket) { this.original.socket = val; }
  public setTimeout(msecs: number, callback: () => void): this {
    this.original.setTimeout(msecs, callback);
    return this;
  }
  public destroy(error?: Error): void { this.original.destroy(error); }

  // Readable
  public get readable(): boolean { return this.original.readable; }
  public set readable(val: boolean) { this.original.readable = val; }
  public get readableHighWaterMark(): number { return this.original.readableHighWaterMark; }
  public get readableLength(): number { return this.original.readableLength; }

  public _read(size: number): void { this.original._read(size); }
  public read(size?: number): any { this.original.read(size); }
  public setEncoding(encoding: string): this { this.original.setEncoding(encoding); return this; }
  public pause(): this { this.original.pause(); return this; }
  public resume(): this { this.original.resume(); return this; }
  public isPaused(): boolean { return this.original.isPaused(); }
  public unpipe(destination?: NodeJS.WritableStream): this { this.original.unpipe(destination); return this; }
  public unshift(chunk: any): void { this.original.unshift(chunk); }
  public wrap(oldStream: NodeJS.ReadableStream): this { this.original.wrap(oldStream); return this; }
  public push(chunk: any, encoding?: string): boolean { return this.original.push(chunk, encoding); }
  public _destroy(error: Error | null, callback: (error: Error | null) => void): void { this.original._destroy(error, callback); }
  public [Symbol.asyncIterator](): AsyncIterableIterator<any> {
    return this.original[Symbol.asyncIterator]();
  }

  // Stream
  public pipe<T extends NodeJS.WritableStream>(destination: T, options?: { end?: boolean; }): T {
    return this.original.pipe<T>(destination, options);
  }

  // Event Emitter
  public addListener(event: "close", listener: () => void): this;
  public addListener(event: "data", listener: (chunk: any) => void): this;
  public addListener(event: "end", listener: () => void): this;
  public addListener(event: "readable", listener: () => void): this;
  public addListener(event: "error", listener: (err: Error) => void): this;
  public addListener(event: string | symbol, listener: (...args: any[]) => void): this {
    this.original.addListener(event, listener);
    return this;
  }
  public on(event: "close", listener: () => void): this;
  public on(event: "data", listener: (chunk: any) => void): this;
  public on(event: "end", listener: () => void): this;
  public on(event: "readable", listener: () => void): this;
  public on(event: "error", listener: (err: Error) => void): this;
  public on(event: string | symbol, listener: (...args: any[]) => void): this {
    this.original.on(event, listener);
    return this;
  }
  public once(event: "close", listener: () => void): this;
  public once(event: "data", listener: (chunk: any) => void): this;
  public once(event: "end", listener: () => void): this;
  public once(event: "readable", listener: () => void): this;
  public once(event: "error", listener: (err: Error) => void): this;
  public once(event: string | symbol, listener: (...args: any[]) => void): this {
    this.original.once(event, listener);
    return this;
  }
  public prependListener(event: "close", listener: () => void): this;
  public prependListener(event: "data", listener: (chunk: any) => void): this;
  public prependListener(event: "end", listener: () => void): this;
  public prependListener(event: "readable", listener: () => void): this;
  public prependListener(event: "error", listener: (err: Error) => void): this;
  public prependListener(event: string | symbol, listener: (...args: any[]) => void): this {
    this.original.prependListener(event, listener);
    return this;
  }
  public prependOnceListener(event: "close", listener: () => void): this;
  public prependOnceListener(event: "data", listener: (chunk: any) => void): this;
  public prependOnceListener(event: "end", listener: () => void): this;
  public prependOnceListener(event: "readable", listener: () => void): this;
  public prependOnceListener(event: "error", listener: (err: Error) => void): this;
  public prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this {
    this.original.prependOnceListener(event, listener);
    return this;
  }
  public removeListener(event: "close", listener: () => void): this;
  public removeListener(event: "data", listener: (chunk: any) => void): this;
  public removeListener(event: "end", listener: () => void): this;
  public removeListener(event: "readable", listener: () => void): this;
  public removeListener(event: "error", listener: (err: Error) => void): this;
  public removeListener(event: string | symbol, listener: (...args: any[]) => void): this {
    this.original.removeListener(event, listener);
    return this;
  }
  public off(event: "close", listener: () => void): this;
  public off(event: "data", listener: (chunk: any) => void): this;
  public off(event: "end", listener: () => void): this;
  public off(event: "readable", listener: () => void): this;
  public off(event: "error", listener: (err: Error) => void): this;
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
  public emit(event: "data", chunk: any): boolean;
  public emit(event: "end"): boolean;
  public emit(event: "readable"): boolean;
  public emit(event: "error", err: Error): boolean;
  public emit(event: string | symbol, ...args: any[]): boolean {
    return this.original.emit(event, ...args);
  }
  public eventNames(): Array<string | symbol> { return this.original.eventNames(); }
  public listenerCount(type: string | symbol): number { return this.original.listenerCount(type); }
}
