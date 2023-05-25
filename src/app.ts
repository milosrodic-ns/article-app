import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import "express-async-errors";
import { AppRouter } from "./utilities/AppRouter";
import { notFoundHandler } from "./utilities/NotFoundHandler";
import { errorHandler } from "./utilities/ErrorHandler";
import { AppDataSource } from "./app.datasource";

import "./article.controller";

const app = express();

app.use("/api", AppRouter.getInstance());

app.use(notFoundHandler);
app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    app.listen(process.env.APP_PORT, () => {
      console.log(`App is listening on port ${process.env.APP_PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database error", err);
  });
