const { createRoom, getRoom } = require("../helpers/videoHelper");
const call = async  (req, res) => {
    const roomId = req.params.id;
  
    const room = await getRoom(roomId);
    if (room.error) {
      const newRoom = await createRoom(roomId);
      res.status(200).send(newRoom);
    } else {
      res.status(200).send(room);
    }
  }

module.exports={call}