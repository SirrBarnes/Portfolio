import axios from "axios";

const api = axios.create({
  baseURL: "https://minesweeper-api.azurewebsites.net",
});

export const createGame = async (
  rows: number,
  columns: number,
  mines: number
) => {
  const response = await api.post(`/api/Games/new`, {
    rows,
    columns,
    mines,
  });

  return response.data;
};

export const revealCell = async (
  gameId: string,
  row: number,
  col: number
) => {
  const response = await api.patch(
    `/${api}/api/Games/${gameId}/reveal`,
    {
      row,
      col,
    }
  );

  return response.data;
};

export const toggleFlag = async (
  gameId: string,
  row: number,
  col: number
) => {
  const response = await api.patch(
    `/${api}/api/Games/${gameId}/switch-flag`,
    {
      row,
      col,
    }
  );

  return response.data;
};

export const getGame = async (
) => {
  const response = await api.get(
    `/${api}/api/Games`
  );

  return response.data;
};

export const deleteGame = async (
    gameId: string
) => {
    const response = await api.delete(
        `/${api}/api/Games/${gameId}`
    );

    return response.data;
}