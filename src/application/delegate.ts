import { Server } from "http";
import { Socket, AddressInfo, ListenOptions } from "net";

type CallbackHandler = () => void;

export abstract class ServerDelegate implements Server {
  protected abstract server: Server;

  // http.Server
  public get maxHeadersCount(): number { return this.server.maxHeadersCount; }
  public set maxHeadersCount(count: number) { this.server.maxHeadersCount = count; }
  public get timeout(): number { return this.server.timeout; }
  public set timeout(ms: number) { this.server.timeout = ms; }
  public get keepAliveTimeout(): number { return this.server.keepAliveTimeout; }
  public set keepAliveTimeout(ms: number) { this.server.keepAliveTimeout = ms; }
  // for supertest
  public get _handle(): any { return (this.server as any)._handle; }

  public setTimeout(msecs?: number | CallbackHandler, callback?: CallbackHandler): this {
    if (typeof msecs === "number") {
      this.server.setTimeout(msecs, callback);
    } else if (msecs) {
      this.server.setTimeout(msecs);
    } else {
      this.server.setTimeout();
    }
    return this;
  }

  // net.Server
  public get maxConnections(): number { return this.server.maxConnections; }
  public set maxConnections(count: number) { this.server.maxConnections = count; }
  public get connections(): number { return this.server.connections; }
  public set connections(count: number) { this.server.connections = count; }
  public get listening(): boolean { return this.server.listening; }
  public set listening(val: boolean) { this.server.listening = val; }

  public listen(port?: number, hostname?: string, backlog?: number, listeningListener?: Function): this;
  public listen(port?: number, hostname?: string, listeningListener?: Function): this;
  public listen(port?: number, backlog?: number, listeningListener?: Function): this;
  public listen(port?: number, listeningListener?: Function): this;
  public listen(path: string, backlog?: number, listeningListener?: Function): this;
  public listen(path: string, listeningListener?: Function): this;
  public listen(options: ListenOptions, listeningListener?: Function): this;
  public listen(handle: any, backlog?: number, listeningListener?: Function): this;
  public listen(handle: any, listeningListener?: Function): this;
  public listen(...args: any[]): this {
    this.server.listen(...args);
    return this;
  }

  public close(callback?: Function): this {
    this.server.close(callback);
    return this;
  }
  public address(): AddressInfo | string {
    return this.server.address();
  }
  public getConnections(cb: (error: Error | null, count: number) => void): void {
    this.getConnections(cb);
  }
  public ref(): this {
   this.server.ref();
   return this;
  }
  public unref(): this {
    this.server.unref();
    return this;
  }

  // EventEmitter
  public addListener(event: "close", listener: () => void): this;
  public addListener(event: "connection", listener: (socket: Socket) => void): this;
  public addListener(event: "error", listener: (err: Error) => void): this;
  public addListener(event: "listening", listener: () => void): this;
  public addListener(event: string, listener: (...args: any[]) => void): this {
    this.server.addListener(event, listener);
    return this;
  }

  public emit(event: "close"): boolean;
  public emit(event: "connection", socket: Socket): boolean;
  public emit(event: "error", err: Error): boolean;
  public emit(event: "listening"): boolean;
  public emit(event: string, ...args: any[]): boolean {
    return this.server.emit(event, ...args);
  }

  public on(event: "close", listener: () => void): this;
  public on(event: "connection", listener: (socket: Socket) => void): this;
  public on(event: "error", listener: (err: Error) => void): this;
  public on(event: "listening", listener: () => void): this;
  public on(event: string, listener: (...args: any[]) => void): this {
    this.server.on(event, listener);
    return this;
  }

  public once(event: "close", listener: () => void): this;
  public once(event: "connection", listener: (socket: Socket) => void): this;
  public once(event: "error", listener: (err: Error) => void): this;
  public once(event: "listening", listener: () => void): this;
  public once(event: string, listener: (...args: any[]) => void): this {
    this.server.once(event, listener);
    return this;
  }

  public prependListener(event: "close", listener: () => void): this;
  public prependListener(event: "connection", listener: (socket: Socket) => void): this;
  public prependListener(event: "error", listener: (err: Error) => void): this;
  public prependListener(event: "listening", listener: () => void): this;
  public prependListener(event: string, listener: (...args: any[]) => void): this {
    this.server.prependListener(event, listener);
    return this;
  }

  public prependOnceListener(event: "close", listener: () => void): this;
  public prependOnceListener(event: "connection", listener: (socket: Socket) => void): this;
  public prependOnceListener(event: "error", listener: (err: Error) => void): this;
  public prependOnceListener(event: "listening", listener: () => void): this;
  public prependOnceListener(event: string, listener: (...args: any[]) => void): this {
    this.server.prependOnceListener(event, listener);
    return this;
  }

  public removeListener(event: "close", listener: () => void): this;
  public removeListener(event: "connection", listener: (socket: Socket) => void): this;
  public removeListener(event: "error", listener: (err: Error) => void): this;
  public removeListener(event: "listening", listener: () => void): this;
  public removeListener(event: string | symbol, listener: (...args: any[]) => void): this {
    this.server.removeListener(event, listener);
    return this;
  }

  public off(event: "close", listener: () => void): this;
  public off(event: "connection", listener: (socket: Socket) => void): this;
  public off(event: "error", listener: (err: Error) => void): this;
  public off(event: "listening", listener: () => void): this;
  public off(event: string | symbol, listener: (...args: any[]) => void): this {
    this.server.off(event, listener);
    return this;
  }
  public removeAllListeners(): this {
    this.server.removeAllListeners();
    return this;
  }
  public setMaxListeners(n: number): this { this.server.setMaxListeners(n); return this; }
  public getMaxListeners(): number { return this.server.getMaxListeners(); }
  public listeners(event: string | symbol): Function[] { return this.server.listeners(event); }
  public rawListeners(event: string | symbol): Function[] { return this.server.rawListeners(event); }
  public eventNames(): Array<string | symbol> { return this.server.eventNames(); }
  public listenerCount(type: string | symbol): number { return this.server.listenerCount(type); }
}
