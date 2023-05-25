import { Request, Response, NextFunction } from "express";
import { Controller, Get, Post } from "./decorators";
import { ArticleService } from "./services/article.service";

@Controller("/articles")
export class ArticleController {
  @Get()
  async articles(req: Request, res: Response, next: NextFunction) {
    const articleService = new ArticleService();
    const findResult = await articleService.getArticles();
    res.json(findResult);
  }

  @Post("/import")
  async import(req: Request, res: Response, next: NextFunction) {
    const articleService = new ArticleService();
    const importResult = await articleService.importArticles(
      Object.keys(req.query)[0]
    );
    res.json({
      message: importResult,
    });
  }
}
