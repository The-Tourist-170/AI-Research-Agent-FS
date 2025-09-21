"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPool = getPool;
const pg_1 = require("pg");
let pool;
function getPool() {
    if (!pool) {
        let connectionOptions;
        if (process.env.DATABASE_URL) {
            connectionOptions = {
                connectionString: process.env.DATABASE_URL,
                ssl: {
                    rejectUnauthorized: false
                }
            };
        }
        else {
            connectionOptions = {
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT || '5432', 10),
                database: process.env.DB_NAME,
            };
        }
        pool = new pg_1.Pool({
            ...connectionOptions,
            connectionTimeoutMillis: 5000,
            max: 20
        });
    }
    return pool;
}
