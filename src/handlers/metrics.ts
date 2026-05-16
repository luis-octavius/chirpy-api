import { config } from "../config.js";
import { Request, Response } from "express";

export async function handlerMetrics(_: Request, res: Response) {
  res.set({
    "Content-Type": "text/plain; charset=utf-8",
  });

  res.send(`Hits: ${config.fileServerHits}`);
}

export async function handlerResetMetrics(_: Request, res: Response) {
  config.fileServerHits = 0;

  res.on("finish", () => {
    console.log("Reset successful");
  });
  res.end();
}
