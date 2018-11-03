import { Application } from "../../src";
import { assert } from "chai";
import { Server } from "http";

describe("Application / Delegate", () => {
  let app: Application;
  let server: Server;

  beforeEach(() => {
    app = new Application();
    server = (app as any).server as Server;
  });

  it("#maxHeadersCount", () => {
    app.maxHeadersCount = 100;
    assert.deepEqual(app.maxHeadersCount, server.maxHeadersCount);
  });

  it("#timeout", () => {
    app.timeout = 100;
    assert.deepEqual(app.timeout, server.timeout);
  });

  it("#keepAliveTimeout", () => {
    app.keepAliveTimeout = 100;
    assert.deepEqual(app.keepAliveTimeout, server.keepAliveTimeout);
  });
});
