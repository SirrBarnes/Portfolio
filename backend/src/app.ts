import express from "express";
import minesweeperRoutes from "./routes/minesweeper.routes";

const app = express();

app.use(express.json());

app.use("/api/games", minesweeperRoutes);

export default app;