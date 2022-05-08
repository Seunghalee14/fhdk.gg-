import cookieCutter from "cookie-cutter";

export const UseCookie = (server) => {
  cookieCutter.set("server", server);
};
