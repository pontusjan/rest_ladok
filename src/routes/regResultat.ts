import { Router, Request, Response } from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import dotenv from "dotenv";

dotenv.config();

const router: Router = Router();
let db: any;

const initDB = async () => {
   db = await open({
      filename: process.env.DATABASE_FILE || "./database/database.sqlite",
      driver: sqlite3.Database,
   });
};

initDB().catch((err) => {
   console.error("Failed to initialize the database:", err);
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
   const { personnummer, kurskod, modul, datum, betyg } = req.body;

   const errors: string[] = [];

   if (!/^\d{10}$|^\d{12}$/.test(personnummer)) {
      errors.push("personnummer must be either 10 or 12 digits, no dash.");
   }

   if (!/^[A-Za-z]\d{4}[A-Za-z]$/.test(kurskod)) {
      errors.push(
         'kurskod must be in the format Letter, 4 numbers, Letter (e.g., "D0031N").'
      );
   }

   if (!/^\d{4}$/.test(modul)) {
      errors.push('modul must be a 4-digit string (e.g., "0005").');
   }

   if (!/^\d{4}-\d{2}-\d{2}$/.test(datum)) {
      errors.push("datum must be a valid date in YYYY-MM-DD format.");
   } else {
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
      const existingRecord = await db.get(
         `SELECT * FROM results WHERE personnummer = ? AND kurskod = ? AND modul = ?`,
         [personnummer, kurskod, modul]
      );

      if (existingRecord) {
         res.status(409).json({
            status: "error",
            message:
               "A record with the same personnummer, kurskod, and modul already exists.",
         });
         return;
      }

      // Insert the new record
      await db.run(
         `INSERT INTO results (personnummer, kurskod, modul, datum, betyg) VALUES (?, ?, ?, ?, ?)`,
         [personnummer, kurskod, modul, datum, betyg]
      );

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
   } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({
         status: "error",
         message: "Internal server error.",
      });
   }
});

export default router;
