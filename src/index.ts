import express, { Application, Request, Response } from "express";
import regResultatRouter from "./routes/regResultat";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 8000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
   res.send("Ladok REST Service is running.");
});

app.use("/reg_resultat", regResultatRouter);

app.listen(PORT, () => {
   console.log(`Ladok server is running at http://localhost:${PORT}`);
});
