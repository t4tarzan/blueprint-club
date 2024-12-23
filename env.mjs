import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NEXTAUTH_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(1),
    BOXYHQ_SAML_CLIENT_ID: z.string().min(1),
    BOXYHQ_SAML_CLIENT_SECRET: z.string().min(1),
    BOXYHQ_SAML_ISSUER: z.string().url(),
    BOXYHQ_SAML_TENANT_ID: z.string().min(1),
    DATABASE_URL: z.string().url(),
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z.string().min(1),
    SMTP_USER: z.string().min(1),
    SMTP_PASSWORD: z.string().min(1),
    SMTP_FROM: z.string().email(),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  },
  runtimeEnv: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    BOXYHQ_SAML_CLIENT_ID: process.env.BOXYHQ_SAML_CLIENT_ID,
    BOXYHQ_SAML_CLIENT_SECRET: process.env.BOXYHQ_SAML_CLIENT_SECRET,
    BOXYHQ_SAML_ISSUER: process.env.BOXYHQ_SAML_ISSUER,
    BOXYHQ_SAML_TENANT_ID: process.env.BOXYHQ_SAML_TENANT_ID,
    DATABASE_URL: process.env.DATABASE_URL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_FROM: process.env.SMTP_FROM,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
});
