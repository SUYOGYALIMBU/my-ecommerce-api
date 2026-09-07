import { Request, Response } from "express";
import express from "express"

import { signup, login } from "../controllers/auth";
const router = express.Router();

router.post("/api/signup-1", (req: Request, res: Response) => {
  // validations
  // receive data from req.body
  // using bcrypt has the password
  // store in database

  // bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
  // User.create({name:"Ram"},(data,err) =>{
  // callback hell
  // })
  // });
  // let users = [];
  // bcrypt.hash(req.body.password, 10).then((hash) => {
  //   users.push({
  //     name: req.body.name,
  //     email: req.body.email,
  //     password: hash,
  //   });
  //   res.send(users);
  // });
});

router.post("/api/signup", signup);
router.post("/api/login", login);

// export defaut router
// module.exports = router;
export default router;
