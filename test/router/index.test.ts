import { Application } from "../../src";
import supertest from "supertest";
import { RouteDelegate } from "../../src/router/route_delegate";
import { VERBS } from "../../src/verbs";

describe("Router", () => {
  let app: Application;

  beforeEach(() => {
    app = new Application();
  });

  describe("routing", () => {
    const routes = [
      "/foo",
      "/bar",
      "/fool",
      "/foolish",
      "/fo",
      "/ban",
      "/a/b/c/d/e/f/g",
      "/parametic",
    ];

    beforeEach(() => {
      routes.forEach((route) => {
        app.get(route, async (context) => {
          context.res.send(200, route);
        });
      });

      app.get("/parametic/<num>", async (context) => {
        const num = context.params.num!;
        const retNum = parseInt(num, 10) * 2;
        context.res.send(200, `${retNum}`);
      });

      app.get("/wild/*card", async (context) => {
        context.res.send(200, context.params.card!);
      });
    });

    routes.forEach((route) => {
      it(`GET ${route}`, () => {
        return supertest(app).get(route).expect(200, route);
      });

      it(`GET ${route}/`, () => {
        return supertest(app).get(route + "/").expect(200, route);
      });
    });

    it("GET /parametic/123", () => {
      return supertest(app).get("/parametic/123").expect(200, "246");
    });

    it("GET /wild/flexible", () => {
      return supertest(app).get("/wild/flexible").expect(200, "flexible");
    });
  });

  describe("methods", () => {
    const methods: Array<
      keyof Pick<
        RouteDelegate,
        "get" | "post" | "put" | "patch" | "delete" | "options" | "head"
      >> = ["get", "post", "put", "patch", "delete", "options", "head"];

    beforeEach(() => {
      methods.forEach((method) => {
        app[method]("/", async (context) => {
          context.res.send(200, method);
        });

        app.match(method.toUpperCase() as VERBS, "/match", async (context) => {
          context.res.send(204);
        });
      });

      app.all("/all", async (context) => {
        context.res.send(204);
      });
    });

    methods.forEach((method) => {
      it(`${method.toUpperCase()} /`, () => {
        if (method !== "head") {
          return supertest(app)[method]("/").expect(200, method);
        } else {
          return supertest(app)[method]("/").expect(200);
        }
      });

      it(`${method.toUpperCase()} /match`, () => {
        return supertest(app)[method]("/match").expect(204);
      });

      it(`${method.toUpperCase()} /all`, () => {
        return supertest(app)[method]("/all").expect(204);
      });
    });
  });
});
