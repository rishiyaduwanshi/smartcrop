// prisma/turso-push.js
// Reads all migration SQL files and applies them to Turso cloud DB

import { createClient } from "@libsql/client";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

const migrationsDir = join(process.cwd(), "prisma", "migrations");

async function main() {
    console.log("🚀 Pushing migrations to Turso...");
    console.log("   DB:", process.env.TURSO_DATABASE_URL);

    // Create migrations tracking table if not exists
    await client.execute(`
        CREATE TABLE IF NOT EXISTS _prisma_migrations (
            id TEXT PRIMARY KEY,
            checksum TEXT NOT NULL,
            finished_at DATETIME,
            migration_name TEXT NOT NULL,
            logs TEXT,
            rolled_back_at DATETIME,
            started_at DATETIME NOT NULL DEFAULT current_timestamp,
            applied_steps_count INTEGER NOT NULL DEFAULT 0
        )
    `);

    // Get all migration folders sorted
    const folders = (await readdir(migrationsDir, { withFileTypes: true }))
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
        .sort();

    for (const folder of folders) {
        // Check if already applied
        const existing = await client.execute({
            sql: "SELECT id FROM _prisma_migrations WHERE migration_name = ?",
            args: [folder],
        });

        if (existing.rows.length > 0) {
            console.log(`  ✓ Already applied: ${folder}`);
            continue;
        }

        const sqlPath = join(migrationsDir, folder, "migration.sql");
        const sql = await readFile(sqlPath, "utf-8");

        // Split statements and execute each
        const statements = sql
            .split(";")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);

        for (const stmt of statements) {
            await client.execute(stmt + ";");
        }

        // Mark as applied
        await client.execute({
            sql: "INSERT INTO _prisma_migrations (id, checksum, migration_name, finished_at, applied_steps_count) VALUES (?, ?, ?, datetime('now'), ?)",
            args: [crypto.randomUUID(), folder, folder, statements.length],
        });

        console.log(`  ✓ Applied: ${folder}`);
    }

    console.log("✅ Turso schema is up to date!\n");
    await client.close();
}

main().catch((e) => {
    console.error("❌ Turso push failed:", e.message);
    process.exit(1);
});
