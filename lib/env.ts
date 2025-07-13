if (!process.env.ADMIN_EMAIL) throw new Error("Missing ADMIN_EMAIL")
if (!process.env.ADMIN_PASSWORD) throw new Error("Missing ADMIN_PASSWORD")
if (!process.env.ADMIN_SECRET) throw new Error("Missing ADMIN_SECRET")

export const env = {
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  ADMIN_SECRET: process.env.ADMIN_SECRET,
}
