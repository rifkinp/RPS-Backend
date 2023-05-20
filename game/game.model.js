const md5 = require("md5");
const db = require("../db/models");
const {Op, Sequelize} = require("sequelize");
class gameModel {
    // cek single user
    getSingleUser = async idUser => {
        try {
            return await db.User.findOne({where: {id: idUser}});
        } catch (error) {
            throw new Error(
                "Failed to get user information : " + error.message
            );
        }
    };

    //update single user
    updateGameResult = async (resultGame, gameName, idUser) => {
        try {
            const userGame = await db.GameHistory.create({
                status: resultGame,
                user_id: idUser,
                game_name: gameName,
            });
            return userGame;
        } catch (error) {
            throw new Error("Failed update game Result : " + error.message);
        }
    };

    //Cek history single ID
    dataGameHistory = async idUser => {
        try {
            return await db.User.findOne({
                where: {id: idUser},
                include: [db.GameHistory],
            });
        } catch (error) {
            throw new Error("Failed to get history game : " + error.message);
        }
    };

    // cek nameRoom
    checkRoomName = async roomName => {
        try {
            return await db.gameRooms.findOne({where: {roomName: roomName}});
        } catch (error) {
            throw new Error("Failed to check Room Name : " + error.message);
        }
    };

    // Record Room Game Name
    createGameRoom = async (roomName, choicePlayer1, player1) => {
        try {
            const gameRoom = await db.gameRooms.create({
                roomName: roomName,
                choicePlayer1: choicePlayer1,
                idPlayer1: player1,
                statusRoom: "Available",
            });
            return gameRoom;
        } catch (error) {
            throw new Error("Failed to create new Room : " + error.message);
        }
    };

    //cari semua room
    getAllRoom = async () => {
        try {
            const roomList = await db.gameRooms.findAll({
                include: [
                    {
                        model: db.User,
                        as: "player1",
                    },
                    {
                        model: db.User,
                        as: "player2",
                    },
                ],
            });
            return roomList;
        } catch (error) {
            throw new Error("Failed to get all Room Data : " + error.message);
        }
    };

    // Get Single Room Detail
    singleRoomDetail = async idRoom => {
        try {
            const roomSingleList = await db.gameRooms.findOne({
                where: {id: idRoom},
                include: [
                    {
                        model: db.User,
                        as: "player1",
                    },
                    {
                        model: db.User,
                        as: "player2",
                    },
                ],
                raw: true,
            });
            return roomSingleList;
        } catch (error) {
            throw new Error("Failed to get room detail : " + error.message);
        }
    };

    updatePlayer2Detail = async (choicePlayer2, idPlayer2, idRoom) => {
        try {
            const idRoomInt = parseInt(idRoom);
            const updatePlayer2 = await db.gameRooms.update(
                {
                    choicePlayer2: choicePlayer2,
                    idPlayer2: idPlayer2,
                },
                {where: {id: idRoomInt}}
            );
            return updatePlayer2;
        } catch (error) {
            throw new Error(
                "Failed to input player2 detail : " + error.message
            );
        }
    };

    // dapatkan info room
    getChoicePlayer1 = async idRoom => {
        try {
            const roomSingleList = await db.gameRooms.findOne({
                where: {id: idRoom},
                include: [
                    {
                        model: db.User,
                        as: "player1",
                    },
                    {
                        model: db.User,
                        as: "player2",
                    },
                ],
            });
            return roomSingleList;
        } catch (error) {
            throw new Error(
                "Failed to retrieve room information : " + error.message
            );
        }
    };

    updateHistoryRoom = async (x1Result, y1Result, idRoom) => {
        const idRoomInt = parseInt(idRoom);
        console.log(idRoomInt);
        try {
            const updatePlayer2 = await db.gameRooms.update(
                {
                    hasilPlayer1: x1Result,
                    hasilPlayer2: y1Result,
                    statusRoom: "Completed",
                },
                {where: {id: idRoomInt}}
            );
            return updatePlayer2;
        } catch (error) {
            throw new Error(
                "Failed to update game room history : " + error.message
            );
        }
    };

    getRoomDetail = async id => {
        try {
            const roomList = await db.gameRooms.findAll({
                attributes: [
                    "roomName",
                    "updatedAt",
                    "idPlayer1",
                    "idPlayer2",
                    "hasilPlayer1",
                    "hasilPlayer2",
                ],
                where: {
                    [Op.or]: [{idPlayer1: id}, {idPlayer2: id}],
                    [Op.and]: [
                        {hasilPlayer1: {[Op.ne]: null}},
                        {hasilPlayer2: {[Op.ne]: null}},
                    ],
                },
                raw: true,
            });

            return roomList.map(room => ({
                idPlayer:
                    room.idPlayer1 === id ? room.idPlayer1 : room.idPlayer2,
                hasilPlayer:
                    room.idPlayer1 === id
                        ? room.hasilPlayer1
                        : room.hasilPlayer2,
                roomName: room.roomName,
                updatedAt: room.updatedAt,
            }));
        } catch (error) {
            throw new Error(
                "Failed to retrieve room details : " + error.message
            );
        }
    };

    // PLayer vs Computer
    // Function to get random choice for computer

    // Create Room vs Computer
    createGameRoomVsComputer = async (
        roomName,
        choicePlayer1,
        choicePlayer2,
        player1,
        hasilPlayer1,
        hasilPlayer2
    ) => {
        try {
            const gameRoom = await db.gameRooms.create({
                roomName,
                choicePlayer1,
                idPlayer1: player1,
                choicePlayer2,
                idPlayer2: 2, // Mengubah ID player 2 menjadi nilai 99 (integer)
                hasilPlayer1,
                hasilPlayer2,
                statusRoom: "Completed", // Mengubah status room menjadi "Completed"
            });
            return gameRoom;
        } catch (error) {
            throw new Error(
                "Failed to create game room with computer : " + error.message
            );
        }
    };
}

module.exports = new gameModel();
