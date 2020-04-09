const express = require("express");
const server = express();

const postsRouter = require("./posts/router.js");

server.use(express.json());
server.use("/api/posts", postsRouter);

server.get("/", (req, res) => {
   res.send(`
    <h2>Posts API</h>
    <p>Hello!</p>
  `);
});

server.listen(process.env.PORT || 5000, () => {
   console.log("\n*** Server running! ***\n");
});
