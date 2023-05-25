import { Request, Response } from "express";

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    status: 404,
    message: "Not Found",
    url: `${req.method} ${req.url}`,
  });
};
