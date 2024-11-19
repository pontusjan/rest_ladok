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

router.get("/", async (req: Request, res: Response): Promise<void> => {
    console.log("GET /getResultat");    
    
    const query = `
        SELECT * FROM results;
    `;
    
    try {
        const result = await db.all(query);
        res.status(200).json({
            status: "success",
            data: result,
        });
    } catch (err) {
        console.error("Failed to get resultat:", err);
        res.status(500).json({
            status: "error",
            message: "Failed to get resultat.",
        });
    }
});

export default router;