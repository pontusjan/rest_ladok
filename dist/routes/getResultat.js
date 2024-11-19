"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
let db;
const initDB = () => __awaiter(void 0, void 0, void 0, function* () {
    db = yield (0, sqlite_1.open)({
        filename: process.env.DATABASE_FILE || "./database/database.sqlite",
        driver: sqlite3_1.default.Database,
    });
});
initDB().catch((err) => {
    console.error("Failed to initialize the database:", err);
});
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("GET /getResultat");
    const query = `
        SELECT * FROM results;
    `;
    try {
        const result = yield db.all(query);
        res.status(200).json({
            status: "success",
            data: result,
        });
    }
    catch (err) {
        console.error("Failed to get resultat:", err);
        res.status(500).json({
            status: "error",
            message: "Failed to get resultat.",
        });
    }
}));
exports.default = router;
