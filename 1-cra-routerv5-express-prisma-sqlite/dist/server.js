"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const crypto_1 = require("crypto");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const sessionTokenId = "session-token";
app.use((0, cors_1.default)({
    origin: "http://localhost:4001",
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.user.findUnique({
            where: { email },
        });
    });
}
function getUserBySessionToken(token) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const session = yield prisma.userSession.findUnique({
            where: { token },
            include: {
                user: true,
            },
        });
        return (_a = session === null || session === void 0 ? void 0 : session.user) !== null && _a !== void 0 ? _a : null;
    });
}
function createUserSession(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const session = yield prisma.userSession.create({
            data: {
                userId,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                token: (0, crypto_1.randomUUID)(),
            },
        });
        return session.token;
    });
}
//-------- session ------------
app.post(`/sign-up`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    const user = yield prisma.user.create({
        data: {
            name,
            email,
        },
    });
    const token = yield createUserSession(user.id);
    res.cookie(sessionTokenId, token).send(user);
}));
app.post(`/login`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield getUserByEmail(email);
    if (!user) {
        res.json({ error: `No user found for email: ${email}` });
        return;
    }
    const token = yield createUserSession(user.id);
    res.cookie(sessionTokenId, token).send(user);
}));
//-------- user ------------
app.get(`/me`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = (req.cookies && req.cookies[sessionTokenId]) || "";
    const user = yield getUserBySessionToken(token);
    res.json(user);
}));
app.post(`/logout`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies[sessionTokenId];
    yield prisma.userSession.delete({
        where: { token },
    });
    res.clearCookie(sessionTokenId);
    res.json({ success: true });
}));
app.get("/users/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const user = yield prisma.user.findUnique({
        where: {
            id: Number(userId),
        },
    });
    if (!user) {
        res.json({ error: `No user found for id: ${userId}` });
        return;
    }
    res.json(user);
}));
// ------------------ Rooms ------------------
app.get("/rooms/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        yield prisma.$connect();
        const rooms = yield prisma.room.findMany({
            where: {
                users: {
                    some: {
                        userId: Number(userId),
                    },
                },
            },
            include: {
                users: true,
            },
        });
        const roomsWithUserIds = rooms.map((room) => {
            const { users } = room, roomWithoutUsers = __rest(room, ["users"]);
            const userIds = users.map((user) => user.userId);
            return Object.assign(Object.assign({}, roomWithoutUsers), { userIds });
        });
        res.json(roomsWithUserIds);
    }
    catch (error) {
        console.log(error);
        res.json({ error: "Something went wrong" });
    }
}));
app.get("/initial-rooms", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rooms = yield prisma.room.findMany();
    res.json(rooms);
}));
app.post(`/set-user-rooms/:userId`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { roomIds } = req.body;
    yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield tx.user.findUnique({
            where: {
                id: Number(userId),
            },
        });
        if (!user) {
            res.json({ error: `No user found for id: ${userId}` });
            return;
        }
        const rooms = yield tx.room.findMany({
            where: {
                id: {
                    in: roomIds,
                },
            },
        });
        for (let i = 0; i < rooms.length; i++) {
            const room = rooms[i];
            yield tx.userOnRoom.create({
                data: {
                    user: {
                        connect: {
                            id: Number(userId),
                        },
                    },
                    room: {
                        connect: {
                            id: room.id,
                        },
                    },
                },
            });
        }
    }));
    res.json({ success: true });
}));
// ------------------ Messages ------------------
app.get("/messages/:roomId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.params;
    const messages = yield prisma.message.findMany({
        where: {
            roomId: Number(roomId),
        },
    });
    res.json(messages);
}));
app.post(`/message`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorId, roomId, content } = req.body;
    const message = yield prisma.message.create({
        data: {
            text: content,
            authorId: Number(authorId),
            roomId: Number(roomId),
        },
    });
    res.json(message);
}));
// ------------------ server ------------------
app.listen(4000, () => console.log(`
🚀 Server ready at: http://localhost:4000`));
//# sourceMappingURL=server.js.map