"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicSchema = void 0;
const zod_1 = require("zod");
exports.TopicSchema = zod_1.z.object({
    topic: zod_1.z.string().trim().min(1, 'Topic cannot be empty')
});
