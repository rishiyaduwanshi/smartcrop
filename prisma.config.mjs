import { defineConfig } from "prisma/config";

// CLI (migrate dev) uses local SQLite.
// Runtime uses Turso via adapter in src/lib/prisma.js
export default defineConfig({
    schema: "./prisma/schema.prisma",
    datasource: {
        url: "file:./prisma/dev.db",
    },
});
