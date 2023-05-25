import axios from "axios";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import { ParsedXMLData } from "../utilities/ParsedXMLDataInterface";
import { AppDataSource } from "../app.datasource";
import { Import } from "../entities/import.entity";
import { Article } from "../entities/article.entity";
import { VowelsCounter } from "../utilities/VowelsCounter";

export class ArticleService {
  public async importArticles(source: string) {
    try {
      const feedResult = await axios.get(source);
      const parsedData = this.parseXML(feedResult.data);
      return await this.insertData(parsedData);
    } catch (e) {
      console.log(e);
      throw new Error("Importer error");
    }
  }

  public async getArticles() {
    const articleRepo = AppDataSource.getRepository(Article);
    const articles = await articleRepo.find();
    return articles.map((article) => {
      const counter = new VowelsCounter(article.title);

      return { ...article, wordWithMostVowelsInTitle: counter.getMostVowels() };
    });
  }

  private parseXML(data: string): ParsedXMLData[] {
    if (!XMLValidator.validate(data)) {
      throw new Error("Bad XML");
    }

    const parser = new XMLParser({ ignoreAttributes: false });

    const items = parser.parse(data).rss.channel.item;

    return items.map((item: any) => {
      const date = new Date(item.pubDate);

      return {
        //@ts-ignore
        id: null,
        externalId: item.guid["#text"] || item.guid,
        title: item.title,
        description: item.description,
        publicationDate: date.toJSON().slice(0, 19).replace("T", " "),
        link: item.link,
        mainPicture:
          item["media:content"]["@_url"] || item["media:content"][1]["@_url"],
      };
    });
  }

  private async insertData(data: ParsedXMLData[]) {
    return await AppDataSource.transaction(async (entityManager) => {
      await entityManager
        .createQueryBuilder()
        .insert()
        .into(Import)
        .values({ rawContent: JSON.stringify(data) })
        .execute();

      const result = await entityManager
        .createQueryBuilder()
        .insert()
        .into(Article)
        .values(data)
        .orUpdate(
          ["title", "description", "publicationDate", "link", "mainPicture"],
          ["externalId"]
        )
        .execute();

      return {
        affectedRows: result.raw.affectedRows,
        changedRows: result.raw.changedRows,
      };
    });
  }
}
