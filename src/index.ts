// src/index.ts

import express, { Application, Request, Response } from "express";

const app: Application = express();
const PORT: number = 8000;

// Middleware to parse JSON bodies
app.use(express.json());

// Root Endpoint
app.get("/", (req: Request, res: Response) => {
   res.send("Ladok REST Service is running.");
});

// Start the Server
app.listen(PORT, () => {
   console.log(`Ladok server is running at http://localhost:${PORT}`);
});
