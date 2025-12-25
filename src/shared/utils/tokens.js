import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'; 

const generateAccessToken = (email) => {
  const jti = uuidv4();
  return jwt.sign(
    { email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY,jwtid: jti }
  );
};

const generateRefreshToken = (email) => {
  const jti = uuidv4(); 
  return jwt.sign(
    { email }, 
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY,jwtid: jti }
  );
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new Error('Invalid access token');
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

// module.exports = {
//   generateAccessToken,
//   generateRefreshToken,
//   verifyAccessToken,
//   verifyRefreshToken,
// };

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
