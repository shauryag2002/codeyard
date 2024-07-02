import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer, { cors: true });
    const roomToUsersMap = {};
    io.on("connection", (socket) => {
        socket.on("message", (message) => {
            io.emit("message", message);
        });
        socket.on('newDate', (data) => {
            socket.broadcast.emit('newDate', data);
        })
        socket.on('notification', async (data) => {

            io.emit('notification', data);
        })
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
        socket.on("room:join", (data) => {
            const { email, room, peerId } = data;
            socket.join(room);
            if (!roomToUsersMap[room]) {
                roomToUsersMap[room] = [{ email, peerId }];
            } else {
                const userIndex = roomToUsersMap[room].findIndex(user => user.email === email);
                if (userIndex === -1) {
                    roomToUsersMap[room].push({ email, peerId });
                } else {
                    roomToUsersMap[room][userIndex].peerId = peerId;
                }
            }
            io.to(room).emit("room:users", roomToUsersMap[room]);

        });

        socket.on('room:leave', (data) => {
            const { email, room } = data;
            socket.leave(room);
            roomToUsersMap[room] = roomToUsersMap[room].filter((user) => user.email !== email);
            io.to(room).emit("room:users", roomToUsersMap[room]);
        });
        socket.on('room:user:toggle:audio', (data) => {
            const { peerId, email, room } = data;
            io.to(room).emit("room:user:toggle:audio", { peerId, email });
        });
        socket.on('room:user:toggle:video', (data) => {
            const { peerId, email, room } = data;
            io.to(room).emit("room:user:toggle:video", { peerId, email });
        });
    });
    const server = httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });

});