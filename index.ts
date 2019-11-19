import { Request, Response, Application } from "express";
import express = require("express");

const app: Application = express();

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

app.listen(3000, () => {
  console.log("listening on 3000 ...");
});
