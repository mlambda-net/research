import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
    resolve: {
        alias: {
            "@MLambda": path.resolve(__dirname, "./src"),
        },
    },
});