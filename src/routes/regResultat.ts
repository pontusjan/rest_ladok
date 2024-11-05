import { Router, Request, Response } from "express";

const router: Router = Router();

router.post("/", (req: Request, res: Response): void => {
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

   // Simulated Ladok registration logic
   // For now, we'll assume the registration is always successful if the input is valid
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
});

export default router;
