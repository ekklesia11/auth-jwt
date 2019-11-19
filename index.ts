import { Request, Response, Application, NextFunction } from "express";
import express = require("express");
import jwt = require("jsonwebtoken");
require("dotenv").config();

const app: Application = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

app.get("/secret", (req: Request, res: Response) => {
  res.json({ body: "hello, sir" });
});

app.get("/jwt", (req: Request, res: Response) => {
  const secret: string = process.env.privateKey;

  const token: string = jwt.sign({ user: "superUser" }, secret);

  console.log("token created:", token);
  res.json(token);
});

const isVerified = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization !== "undefined") {
  }
};

app.listen(3000, () => {
  console.log("listening on 3000 ...");
});
