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
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("POST /regResultat");
    const { personnummer, kurskod, modul, datum, betyg } = req.body;
    const errors = [];
    if (!/^\d{10}$|^\d{12}$/.test(personnummer)) {
        errors.push("personnummer must be either 10 or 12 digits, no dash.");
    }
    if (!/^[A-Za-z]\d{4}[A-Za-z]$/.test(kurskod)) {
        errors.push('kurskod must be in the format Letter, 4 numbers, Letter (e.g., "D0031N").');
    }
    if (!/^\d{4}$/.test(modul)) {
        errors.push('modul must be a 4-digit string (e.g., "0005").');
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datum)) {
        errors.push("datum must be a valid date in YYYY-MM-DD format.");
    }
    else {
        const date = new Date(datum);
        if (isNaN(date.getTime())) {
            errors.push("datum must be a valid date.");
        }
    }
    const validBetyg = ["U", "G", "G#", "VG"];
    if (!validBetyg.includes(betyg)) {
        errors.push('betyg must be one of the following: "U", "G", "G#", "VG".');
    }
    if (errors.length > 0) {
        res.status(400).json({
            status: "error",
            message: "Validation failed.",
            errors: errors.map((msg, index) => ({
                id: index + 1,
                message: msg,
            })),
        });
        return;
    }
    try {
        // Check if a record with the same personnummer, kurskod, and modul exists
        const existingRecord = yield db.get(`SELECT * FROM results WHERE personnummer = ? AND kurskod = ? AND modul = ?`, [personnummer, kurskod, modul]);
        if (existingRecord) {
            res.status(409).json({
                status: "error",
                message: "A record with the same personnummer, kurskod, and modul already exists.",
            });
            return;
        }
        // Insert the new record
        yield db.run(`INSERT INTO results (personnummer, kurskod, modul, datum, betyg) VALUES (?, ?, ?, ?, ?)`, [personnummer, kurskod, modul, datum, betyg]);
        console.log("Transaction registered successfully.");
        // Respond with success
        res.status(200).json({
            status: "success",
            message: "Transaction registered successfully.",
            data: {
                personnummer,
                kurskod,
                modul,
                datum,
                betyg,
            },
        });
    }
    catch (error) {
        console.error("Database error:", error);
        res.status(500).json({
            status: "error",
            message: "Internal server error.",
        });
    }
}));
exports.default = router;
