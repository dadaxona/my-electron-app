const jwt = require("jsonwebtoken");
const SECRET_KEY = "dadaxon1996@";

function generateToken(payload) {  
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "30m" });
}

function verifyToken(data) {
  const token = data && data.token;  
  if (!token) {
    return { statusCode: 404 }
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded && decoded.id && decoded.username && decoded.password) {
      return { statusCode: 200, ...decoded };
    } else {
      return { statusCode: 404 };
    }
  } catch (error) {
    return { statusCode: 404, msg: error }
  }
}

module.exports = { generateToken, verifyToken };
