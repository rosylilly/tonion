const { Application } = require("tonion");

const app = new Application();

app.get("/", async (context) => {
  context.res.send(200, "Hello, World!\n");
});

app.get("/hello/<name>", async (context) => {
  context.res.send(200, `Hello, ${context.params.name}!\n`);
})

app.get("/test", async (context) => {
  context.throw(404);
});

app.listen(3000);
