// @ts-ignore
module.exports = (req, res, next) => {
    req.user = {
      id: "65abc1234567890abcdef12", // fake ObjectId
      role: "student",
      hostel: "A",
      block: "B",
      room: "101"
    };
    next();
  };
  