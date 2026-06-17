import { Router } from "express";
import {
  createGameController,
  revealCellController,
  toggleFlagController,
  getGameController,
  deleteGameController,
} from "../controllers/minesweeper.controller";

const router = Router();

router.post("/new", createGameController);

router.post("/:gameId/reveal", revealCellController);

router.post("/:gameId/switch-flag", toggleFlagController);

router.get("/", getGameController);

router.delete("/:gameId", deleteGameController);

export default router;