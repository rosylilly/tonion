import { Application } from "../../src";
import supertest from "supertest";
import { assert } from "chai";
import { Router } from "../../src/router";

describe("Application", () => {
  let app: Application;

  beforeEach(() => {
    app = new Application();
  });

  it("#env", () => {
    assert.deepEqual(app.env, "development");
  });

  it("#router", () => {
    assert.instanceOf(app.router, Router);
  });

  it("#notFound", () => {
    return supertest(app).get("/").expect(404, "404 Not Found: /");
  });

  it("#use", () => {
    app.use(async (ctx) => {
      ctx.res.send(200, "SUPER TEST");
    });

    return supertest(app).get("/").expect(200, "SUPER TEST");
  });

  it("#getConnections", async () => {
    const count = await app.getConnections();
    assert.deepEqual(count, 0);
  });
});
