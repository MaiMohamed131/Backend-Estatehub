import User from "../../shared/models/User.js";
import blackListTokens from "../../shared/models/BlackListToken.js";
import jwt from "jsonwebtoken";
import { verifyAccessToken } from "../utils/tokens.js";
export const authenticationMiddleware = () => {
  return async (req, res, next) => {
    try {
      const { accesstoken } = req.headers;
      console.log(accesstoken);

      if (!accesstoken)
        return res.status(404).json({ message: "error no token" });

      const decodedtoken = verifyAccessToken(accesstoken);
      console.log(decodedtoken);
      console.log("ggggg");
      const isTokenBlackListed = await blackListTokens.findOne({
        tokenId: decodedtoken.jti,
      });
      if (isTokenBlackListed)
        return res.status(404).json({ message: "this token is blacklisted" });
      console.log(decodedtoken.email);
      console.log("ggggg");

      const user = await User.findOne(
        { email: decodedtoken.email },
        "userName email _id role"
      );
      console.log("userrr is ", user);

      if (!user)
        return res.status(404).json({ message: "error no user found" });
      console.log("ggggg");

      req.loggedInUser = {
        ...user._doc,
        token: { tokenId: decodedtoken.jti, expiryDate: decodedtoken.exp },
      };
      console.log(req.loggedInUser);
      console.log("ggggg");

      next();
    } catch (error) {
      console.log("catch error from authentication middleware ", error);
      let statusCode = 500;
      let errorMessage = "Internal Server Error";
      if (error.message.includes("Invalid access token")) {
        statusCode = 401;
        errorMessage = "Invalid access token provided.";
      } else if (error.name === "TokenExpiredError") {
        statusCode = 401;
        errorMessage = "Access token expired.";
      } else if (error.name === "JsonWebTokenError") {
        statusCode = 401;
        errorMessage = "Malformed token.";
      } else if (
        error.name === "ObjectParameterError" ||
        error.message.includes("ObjectParameterError")
      ) {
        statusCode = 400;
        errorMessage = "Bad request: Database query error.";
      }

      if (statusCode === 500) {
        console.error("UNHANDLED 500 ERROR IN AUTH MIDDLWARE:", error);
      }

      res.status(statusCode).json({ message: errorMessage });
    }
  };
};

export const authorizationMiddleware = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { role } = req.loggedInUser;
      if (!role) return res.status(404).json({ message: "error no role" });
      const isAllowed = allowedRoles.includes(role);
      if (!isAllowed) return res.status(401).json({ message: "unauthorized" });
      next();
    } catch (error) {
      console.log("catch error from authorization middleware ", error);
      res.status(500).json({ message: "intenal server error", error });
    }
  };
};
