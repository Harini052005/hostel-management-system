require("dotenv").config();
const jwt = require("jsonwebtoken");

const token = jwt.sign(
  {
    id: "65abc123abc123abc123abc1", // fake Mongo ObjectId
    role: "student"                // or admin / warden
  },
  // @ts-ignore
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

console.log(token);
