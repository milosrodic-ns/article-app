import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from "typeorm";

@Entity({ name: "articles" })
@Unique(["externalId"])
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  externalId: string;

  @CreateDateColumn()
  importDate: Date;

  @Column({ type: "text" })
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "datetime" })
  publicationDate: Date;

  @Column({ type: "text" })
  link: string;

  @Column({ type: "text" })
  mainPicture: string;
}
