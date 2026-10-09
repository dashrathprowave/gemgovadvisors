import { register } from "node:module";

// Lets `node --test` resolve the app's `@/...` imports (jsconfig paths) the way
// Next's bundler does. Registered via the --import flag in `npm test`.
register("./alias-loader.mjs", import.meta.url);
