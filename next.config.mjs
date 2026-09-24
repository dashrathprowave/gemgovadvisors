/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produces .next/standalone/server.js — a self-contained Node server with only
  // the packages it actually needs. That is the file the Enhance "Deploy Node.js"
  // tool runs, and it keeps the upload small (no full node_modules).
  output: "standalone",

  // The tracer otherwise sweeps the runtime data folders into the standalone
  // build, which would ship stored customer enquiries inside every deployment.
  outputFileTracingExcludes: {
    "*": ["./data/**", "./exports/**", "./deploy/**"],
  },

  // Left to itself the bundler inlines these into the server chunks. Both
  // resolve helpers through dynamic requires (mysql2 loads auth plugins that
  // way), which is fragile once bundled — and the standalone node_modules then
  // has no copy for scripts/db-setup.mjs to import on the server.
  serverExternalPackages: ["mysql2", "nodemailer"],
};

export default nextConfig;
