import io from "socket.io-client";

const STRAPI_ENDPOINT = "https://websocket.fhdk.gg";
export const socket = io(STRAPI_ENDPOINT);

