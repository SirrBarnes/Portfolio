import { api } from "./axios";
import { setToken } from "./auth";


// -------------------- AUTH --------------------

export const register = async (email: string, password: string) => {
  try {
    return await api.post("/api/users/register", {
      email,
      password,
    });
  } catch (err) {
    // ignore "user already exists"
    console.log("Register skipped or already exists");
  }
};

export const login = async (username: string, password: string) => {
  try {
    const res = await api.post("/api/token", {
      username,
      password,
    });

    console.log("🔥 FULL RESPONSE:", res);
    console.log("🔥 RESPONSE DATA:", res.data);

    const token = res.data?.accessToken;

    console.log("🔥 EXTRACTED TOKEN:", token);

    setToken(token);

    return token;
  } catch (err: any) {
    console.log("❌ LOGIN ERROR STATUS:", err.response?.status);
    console.log("❌ LOGIN ERROR DATA:", err.response?.data);
    throw err;
  }
};
export const ensureAuth = async (email: string, password: string, username: string) => {
  await register(email, password);
  return await login(username, password);
};


// -------------------- GAME --------------------

export const createGame = async (
  rows: number,
  columns: number,
  mines: number
) => {
  const res = await api.post("/api/games/new", {
    rows,
    columns,
    mines,
  });

  return res.data;
};

export const revealCell = async (
  gameId: string,
  x: number,
  y: number
) => {
  const res = await api.post(`/api/games/${gameId}/reveal`, {
    x,
    y,
  });

  return res.data;
};

export const toggleFlag = async (
  gameId: string,
  x: number,
  y: number
) => {
  const res = await api.post(`/api/games/${gameId}/switch-flag`, {
    x,
    y,
  });

  return res.data;
};

export const getGame = async () => {
  const res = await api.get(`/api/games/`);
  return res.data;
};

export const deleteGame = async (gameId: string) => {
  const res = await api.delete(`/api/games/${gameId}`);
  return res.data;
};