import type { JwtPayload } from "jsonwebtoken";

export type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;
