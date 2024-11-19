"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const regResultat_1 = __importDefault(require("./routes/regResultat"));
const getResultat_1 = __importDefault(require("./routes/getResultat"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8000;
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Ladok REST Service is running.");
});
app.use("/reg_resultat", regResultat_1.default);
app.use("/get_resultat", getResultat_1.default);
app.listen(PORT, () => {
    console.log(`Ladok server is running at http://localhost:${PORT}`);
});
