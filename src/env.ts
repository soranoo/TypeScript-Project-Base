//Based: https://sdorra.dev/posts/2023-08-22-type-safe-environment

import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),

  USE_TESTNET: z.string().default("true"),

  BYBIT_API_KEY: z.string().optional(),
  BYBIT_API_SECRET: z.string().optional(),

  BYBIT_TESTNET_API_KEY: z.string().optional(),
  BYBIT_TESTNET_API_SECRET: z.string().optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", JSON.stringify(parsed.error.format(), null, 4));
  process.exit(1);
}

const env = parsed.data;

export { env };