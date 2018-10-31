const { Application } = require("tonion");

const app = new Application();

app.get("/", (context) => {
  context.res.send(200, "Hello, World!\n");
});

app.get("/hello/<name>", (context) => {
  context.res.send(200, `Hello, ${context.params.name}!\n`);
})

app.listen(3000);
