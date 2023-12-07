// const wss = new WebSocket(`ws://localhost:3000`);

import { io } from "socket.io-client";

// export {wss}

const postSocket = io(`ws://localhost:3000`);

export {postSocket}