import { Request, Response } from "express";

import {
    createGame,
    revealCell,
    toggleFlag,
    getGame,
    deleteGame,
} from "../services/minesweeper.service";

export const createGameController = async (req: Request, res: Response) => {
    try {
        const { rows, columns, mines } = req.body;

        const game = await createGame(rows, columns, mines);

        res.json(game);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create game" });
    }
};

export const revealCellController = async (req: Request, res: Response) => {
    try {
        const gameId = req.params.gameId;

        if (Array.isArray(gameId)) {
            return res.status(400).json({ error: "Invalid gameId" });
        }
        const { x, y } = req.body;

        const data = await revealCell(gameId, x, y);

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to reveal cell" });
    }
};

export const toggleFlagController = async (req: Request, res: Response) => {
    try {
        const gameId = req.params.gameId;

        if (Array.isArray(gameId)) {
            return res.status(400).json({ error: "Invalid gameId" });
        }
        const { x, y } = req.body;

        const data = await toggleFlag(gameId, x, y);

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to toggle flag" });
    }
};

export const getGameController = async (req: Request, res: Response) => {
    try {

        const game = await getGame();

        res.json(game);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch game" });
    }
};

export const deleteGameController = async (req: Request, res: Response) => {
    try {
        const gameId = req.params.gameId;

        if (Array.isArray(gameId)) {
            return res.status(400).json({ error: "Invalid gameId" });
        }
        const data = await deleteGame(gameId);

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete game" });
    }
};