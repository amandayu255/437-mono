import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import credentials from "../services/credential-svc";

const router = express.Router();

dotenv.config();
const TOP_SECRET: string = process.env.TOP_SECRET || "NOT_A_SECRET";
console.log("JWT Secret (TOP_SECRET):", TOP_SECRET);

function generateAccessToken(
  username: string
): Promise<String> {
  console.log("Signing token for:", username);
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username: username },
      TOP_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) reject(error);
        else resolve(token as string);
      }
    );
  });
}

export function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  // Getting the 2nd part of the auth header (the token)
  const token = authHeader && authHeader.split(" ")[1];
  console.log("Auth Header:", authHeader);
  console.log("Token extracted:", token);
  if (!token) {
    res.status(401).end();
  } else {
    jwt.verify(token, TOP_SECRET, (error, decoded) => {
      if (decoded) {
        console.log("Token verified:", decoded);
        next();
      } else {
        console.log("Token verification failed:", error);
        res.status(403).end();
      }
    });
  }
}

router.post("/register", (req: Request, res: Response) => {
  const { username, password } = req.body; // from form

  if (typeof username !== "string" || typeof password !== "string") {
    res.status(400).send("Bad request: Invalid input data.");
  } else {
    credentials
      .create(username, password)
      .then((creds) => generateAccessToken(creds.username))
      .then((token) => {
        res.status(201).send({ token: token });
      })
      .catch((err) => {
        res.status(409).send({ error: err.message });
      });
  }
});

router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body; // from form

  if (!username || !password) {
    res.status(400).send("Bad request: Invalid input data.");
  } else {
    credentials
      .verify(username, password)
      .then((goodUser: string) => generateAccessToken(goodUser))
      .then((token) => res.status(200).send({ token: token }))
      .catch((error) => res.status(401).send("Unauthorized"));
  }
});

export default router;