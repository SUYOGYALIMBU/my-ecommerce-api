import { Request,Response,NextFunction } from "express";

const checkAdmin = (req:Request, res:Response, next:NextFunction) => {
  if (!req.user.isAdmin) {
    res.status(403).send();
    return;
  }
  next();
};

// module.exports = checkAdmin
export default checkAdmin