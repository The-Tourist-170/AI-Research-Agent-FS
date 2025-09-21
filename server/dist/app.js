"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const queue_1 = __importDefault(require("./db/queue"));
const initDb_1 = require(".//db/initDb");
const routes_1 = __importDefault(require("./routes/routes"));
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
(0, initDb_1.initDb)().catch(err => console.error('Error initializing DB on startup:', err));
queue_1.default.client.ping().catch(err => console.error('Redis connection error on startup:', err));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)({ origin: process.env.ALLOWED_ORIGINS }));
app.use(express_1.default.json());
app.use(routes_1.default);
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
