import { Request, Response, NextFunction } from "express";

export async function middlewareLogResponses(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.on("finish", () => {
    const status = res.statusCode;
    if (status < 200 || status >= 300) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${status}`);
    }
  });

  next();
}
