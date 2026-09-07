import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import z from "zod"
import User from "../models/User";

export const signup = async (req: Request, res: Response) => {
  // validations using zod
  // receive data from req.body
  // using bcrypt has the password
  // store in database
  
  if (!req.body.password) {
    res.status(400).send({
      msg: "Validation Error",
      errors: [
        {
          field: "password",
          msg: "required",
        },
      ],
    });
  }

  if (req.body.password && req.body.password.length < 8) {
    res.status(400).send({
      msg: "Validation Error",
      errors: [
        {
          field: "password",
          msg: "min 8 charcs reuired ",
        },
      ],
    });
  }

  let hash = await bcrypt.hash(req.body.password, 10);

  let user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hash,
  });

  // users.push({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: hash,
  // });

  // core sql: insert into users (name,email,passwrd) values (req.body.name, .. ...... )
  // core mongodb sytanx: users.insertOne({name:"Ram","email":"ram@gmail.com","pasword":"2#$%@$#%34234"})

  // mongoose ORM: User.insertOne({.....})
  // sequalzie ORM : await User.create({name:"Ram","email":"ram@gmail.com","pasword":"2#$%@$#%34234"})

  // res.send(user);
  // res.status(204).send()
  res.send({ msg: "user created successfully" });
};

export const login = async (req: Request, res: Response) => {
  try {
    // let a = b + c;
    const UserValidationSchema = z.object({
      email: z.email(),
      password: z.string().min(8, { error: "min 8 chars required" }),
      // .regex(
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      //   { message: "Password does not meet complexity requirements." },
      // ), // use this regex during signup
    });

    const result = UserValidationSchema.safeParse(req.body);
    console.log(result);

    if (!result.success) {
      const errors = z.flattenError(result.error);
      /* 
      {
        formErrors: [],
        fieldErrors: {
          email: [ 'Invalid input: expected string, received undefined' ],
          password: [ 'Invalid input: expected string, received undefined' ]
        }
      }
      */
      console.log(errors);

      // errors.formErrors = undefined;
      // delete errors.formErrors;
      // errors.errors = errors.fieldErrors;
      // delete errors.fieldErrors;

      let validationErrors = {
        errors: errors.fieldErrors
      }

      let err: Record<string, string> = {};
      let arr = Object.entries(validationErrors.errors);

      arr.forEach((el) => {
        err[el[0]] = el[1].join(", ");
      });

      validationErrors.errors = err;
      res.status(400).send(validationErrors);
      return;
    }

    /* 
    400.send({
      errors: {
        email: 'Invalid input: expected string, received undefined'
        password:  'Invalid input: expected string, received undefined'
      }
    }

    400.send({
      errors: [
      {
        field:email
        msg: 'Invalid input: expected string, received undefined'
      },
      {
        field: password
        msg:'Invalid input: expected string, received undefined'
      }
      ]
    }
    
    */

    // let user = users.find((el) => el.email == req.body.email);
    let user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    // console.log("user",user);
    // console.log("user.password",user.password);

    if (user) {
      // let matched = await bcrypt.compare(req.body.password, user.password);
      let matched = await bcrypt.compare(req.body.password, user.getDataValue("password"));
      if (matched) {
        // const token = jwt.sign(
        //   { id: user.id, firstName: user.firstName, email: user.email },
        //   "OUR-BACKEND-JWT-SECRET-KEY",
        // );
        const token = jwt.sign(
          {
            id: user.getDataValue("id"),
            firstName: user.getDataValue("firstName"),
            isSeller: user.getDataValue("isSeller"),
            isAdmin: user.getDataValue("isAdmin"),
            email: user.getDataValue("email"),
          },
          process.env.JWT_SECRET || "",
        );

        res.status(200).send({
          msg: "login success",
          token,
        });
        return;
      }
    }

    res.status(401).json({
      msg: "invalid credentials",
    });
  } catch (err) {

    let stack = ""
    if (err instanceof Error) {
      stack = err.stack || ""
    }

    res.status(500).send({
      msg: "SERVER error",
      stack: stack,
    });
  }
};

// named exports
// module.exports.login = login;
// module.exports.signup = signup;

// module.exports = {
//   login,
//   signup: signup,
// };

// exprot const login = 
// export const signup = 
