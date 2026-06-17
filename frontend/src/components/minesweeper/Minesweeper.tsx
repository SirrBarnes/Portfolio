import { useEffect, useState } from "react";

import {
  login,
  createGame,
  revealCell,
  toggleFlag,
  getGame,
  deleteGame,
  ensureAuth,
} from "../../api/minesweeper";

type Cell = {
  revealed: boolean;
  flagged: boolean;
  hasMine: boolean;
  adjacentMines: number;
};

export default function Minesweeper() {
  const [board, setBoard] = useState<Cell[][]>(
    []
  );

  const [gameId, setGameId] =
    useState("");

  const [status, setStatus] =
    useState("playing");

  const [rows, setRows] = useState(16);

  const [cols, setCols] = useState(16);

  const [mines, setMines] =
    useState(40);

  const username = 'storres4365';
  const email = 'torressergio1357@gmail.com'
  const password = 'Georgestrait1';

  /* ---------------- START GAME ---------------- */

  useEffect(() => {
    const init = async () => {
      await ensureAuth(username, email, password);
      await createGame(10, 10, 10);
    };

    init();
  }, []);

  useEffect(() => {
    startGame(16, 16, 40);
  }, []);

  const startGame = async (
    newRows: number,
    newCols: number,
    newMines: number
  ) => {
    try {
      const game = await createGame(
        newRows,
        newCols,
        newMines
      );

      setBoard(game.board);

      setStatus("playing");

      setRows(newRows);

      setCols(newCols);

      setMines(newMines);

      console.log(game);
    } catch (err: any) {
      console.log(err.response?.data);
      console.log(err.response?.status);
    }
  };

  /* ---------------- REFRESH ---------------- */

  const refreshBoard = async (
  ) => {
    try {
      const game = await getGame();

      setBoard(game.board);

      if (game.status) {
        setStatus(game.status);
      }
    } catch (err) {
      console.error(
        "Failed to refresh board",
        err
      );
    }
  };

  /* ---------------- CLICK ---------------- */

  const handleClick = async (
    row: number,
    col: number
  ) => {
    if (status !== "playing")
      return;

    try {
      await revealCell(
        gameId,
        row,
        col
      );

      await refreshBoard();
    } catch (err) {
      console.error(
        "Reveal failed",
        err
      );
    }
  };

  /* ---------------- FLAG ---------------- */

  const handleFlag = async (
    e: React.MouseEvent,
    row: number,
    col: number
  ) => {
    e.preventDefault();

    if (status !== "playing")
      return;

    try {
      await toggleFlag(
        gameId,
        row,
        col
      );

      await refreshBoard();
    } catch (err) {
      console.error(
        "Flag failed",
        err
      );
    }
  };

  /* ---------------- CELL SIZE ---------------- */

  const getCellSize = () => {
    if (rows <= 9) return 32;

    if (rows <= 16) return 26;

    return 20;
  };

  const cellSize = getCellSize();

  /* ---------------- RENDER ---------------- */

  return (
    <div
      className="minesweeper"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 8,
        width: "fit-content",
        userSelect: "none",
      }}
    >
      {/* MENU BAR */}

      <div
        style={{
          display: "flex",
          gap: 4,
          paddingBottom: 4,
          borderBottom:
            "1px solid #808080",
        }}
      >
        <button
          onClick={() =>
            startGame(9, 9, 10)
          }
        >
          Beginner
        </button>

        <button
          onClick={() =>
            startGame(16, 16, 40)
          }
        >
          Intermediate
        </button>

        <button
          onClick={() =>
            startGame(16, 30, 99)
          }
        >
          Expert
        </button>
      </div>

      {/* STATUS BAR */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          padding: "4px 8px",
          border:
            "2px inset #c0c0c0",
          background: "#bdbdbd",
          fontWeight: "bold",
        }}
      >
        <div>
          {status === "playing" &&
            "🙂 Playing"}

          {status === "won" &&
            "😎 You Win"}

          {status === "lost" &&
            "💀 Game Over"}
        </div>

        <button
          onClick={() =>
            startGame(
              rows,
              cols,
              mines
            )
          }
        >
          Reset
        </button>
      </div>

      {/* BOARD */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          border:
            "3px inset #808080",
          background: "#bdbdbd",
          width: "fit-content",
        }}
      >
        {board.map((row, r) => (
          <div
            key={r}
            style={{
              display: "flex",
            }}
          >
            {row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                onClick={() =>
                  handleClick(r, c)
                }
                onContextMenu={(e) =>
                  handleFlag(
                    e,
                    r,
                    c
                  )
                }
                style={{
                  width: cellSize,
                  height: cellSize,

                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "center",

                  fontWeight: "bold",

                  cursor: "pointer",

                  border: cell.revealed
                    ? "1px solid #7b7b7b"
                    : "2px outset white",

                  background:
                    cell.revealed
                      ? "#c0c0c0"
                      : "#bdbdbd",

                  fontSize:
                    cellSize * 0.65,
                }}
              >
                {cell.flagged
                  ? "🚩"
                  : cell.revealed
                    ? cell.hasMine
                      ? "💣"
                      : cell.adjacentMines >
                        0
                        ? cell.adjacentMines
                        : ""
                    : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}