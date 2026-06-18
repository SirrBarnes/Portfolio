let token: string | null = null;

export const setToken = (t: string | null) => {
  console.log("💾 SET TOKEN CALLED WITH:", t);
  token = t;
};

export const getToken = () => {
  console.log("📥 GET TOKEN RETURNS:", token);
  return token;
};