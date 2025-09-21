"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controller/controller");
const router = express_1.default.Router();
router.get('/check', controller_1.checkRateLimit);
router.post('/research', controller_1.createResearchTask);
router.get('/research', controller_1.getAllResearchTasks);
router.get('/research/:id', controller_1.getResearchTaskById);
exports.default = router;
