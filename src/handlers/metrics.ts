import { config } from "../config.js";
import { Request, Response } from "express";

export async function handlerMetrics(_: Request, res: Response) {
  res.set({
    "Content-Type": "text/html; charset=utf-8",
  });

  const template = `
    <html>
      <body>
        <h1>Welcome, Chirpy Admin</h1>
        <p>Chirpy has been visited ${config.fileServerHits} times!</p>
      </body>
    </html>
  `;

  res.send(template);
}

export async function handlerResetMetrics(_: Request, res: Response) {
  config.fileServerHits = 0;

  res.on("finish", () => {
    console.log("Reset successful");
  });
  res.end();
}
