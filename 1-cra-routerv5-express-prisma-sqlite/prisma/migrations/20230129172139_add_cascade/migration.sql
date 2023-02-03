-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserOnRoom" (
    "userId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "roomId"),
    CONSTRAINT "UserOnRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserOnRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserOnRoom" ("roomId", "userId") SELECT "roomId", "userId" FROM "UserOnRoom";
DROP TABLE "UserOnRoom";
ALTER TABLE "new_UserOnRoom" RENAME TO "UserOnRoom";
CREATE TABLE "new_Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    CONSTRAINT "Message_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Message_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("authorId", "id", "roomId", "text") SELECT "authorId", "id", "roomId", "text" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
