import { Request, Response, Application, NextFunction } from "express";
import express = require("express");
import jwt = require("jsonwebtoken");
require("dotenv").config();

const app: Application = express();

app.use(express.json());

// mocking DB
const userTable: { user: string; password: string; refreshToken: any } = {
  user: "test@test.com",
  password: "qwe123",
  refreshToken: null
};

const isAuthorized = (req: Request, res: Response, next: NextFunction): any => {
  if (typeof req.headers.authorization !== "undefined") {
    const token: string = req.headers.authorization.split(" ")[1];
    const secret: string = process.env.privateKey;

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "token expired" });
      }
      return next();
    });
  } else {
    res.status(500).json({ error: "Not Authorized" });
  }
};

const generateToken = (user: { email: string }): string => {
  const secret: string = process.env.privateKey;
  const token: string = jwt.sign({ email: user.email }, secret, {
    expiresIn: "30s"
  });
  return token;
};

const generateRefreshToken = (user: string): string => {
  const refresh: string = process.env.refreshKey;
  const token: string = jwt.sign(user, refresh);
  return token;
};

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

app.get("/secret", isAuthorized, (req: Request, res: Response) => {
  res.json({ body: "hello, sir" });
});

app.post("/login", (req: Request, res: Response) => {
  if (
    userTable.user === req.body.email &&
    userTable.password === req.body.password
  ) {
    const refreshToken: string = generateRefreshToken(userTable.user);
    userTable.refreshToken = refreshToken;
    const token: string = generateToken({ email: userTable.user });
    res.json({ token, refreshToken });
  } else {
    res.status(403).json({ error: "email or password is wrong" });
  }
});

app.get("/token", (req: Request, res: Response) => {
  // post refresh token to get a new access token
  if (typeof req.headers.authorization !== "undefined") {
    const refreshToken: string = req.headers.authorization.split(" ")[1];
    const refresh: string = process.env.refreshKey;
    jwt.verify(refreshToken, refresh, (err, decoded: string) => {
      if (err) {
        return res.status(400).json({ error: "Refresh Token is invalid" });
      }
      const accessToken: string = generateToken({ email: decoded });
      return res.status(200).send(accessToken);
    });
  } else {
    return res.status(500).json({ error: "Invalid Token" });
  }
});

app.delete("/logout", (req: Request, res: Response) => {
  userTable.refreshToken = null;
  return res.status(200).send("Logged out");
});

app.listen(3000, () => {
  console.log("listening on 3000 ...");
});
