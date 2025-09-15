import { NextFunction, Request, Response } from "express";

export const greetByName = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({
      status: "success",
      data: { message: `GOOD TO SEE YOU BRO` },
    });
  } catch (error) {
    next(error);
  }
};
