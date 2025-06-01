import { Request, Response, NextFunction, RequestHandler } from "express";

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ message: "Name Email & Password are required" });
    return;
  }

  if (typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  if (password.length < 6){
     res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
      return
}
  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password){
     res.status(400).json({ message: "Email & Password are required" });
    return
    }
  if (typeof email !== "string" || !email.includes("@")){
    res.status(400).json({ message: "Invalid email format" });
    return;
}
  next();
};
