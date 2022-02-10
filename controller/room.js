import Room from "../model/Room"

exports.createRoom = async (req, res) => {
    const { name } = req.body.name;

    const room = await Room.create({ name });

    if (room) {
        return res.status(201).json({
            success: "Created!",
            _id: room._id
      });
    }
}
