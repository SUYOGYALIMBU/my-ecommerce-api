import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"


const checkAuthentication = (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers.authorization?.replace("Bearer ", "") || ""; //undeinfed / null

  try {
    var user = jwt.verify(token, process.env.JWT_SECRET || "");
    // @ts-ignore
    req.user = user;
    next();
  } catch (err) {

    let message = ""
    let stack = ""

    if (err instanceof Error) {
      message = err.message;
      stack = err.stack || "";
    }

    res.status(401).send({
      msg: "invalid credentails | intercepted by middleware",
      error: process.env.APP_ENV == "local" ? message : null,
      stack: process.env.APP_ENV == "local" ? stack : null,
    });
  }
};

// module.exports = checkAuthentication;
export default checkAuthentication
