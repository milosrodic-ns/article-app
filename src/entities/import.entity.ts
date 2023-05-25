import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity({ name: "imports" })
export class Import {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  importDate: Date;

  @Column({ type: "text" })
  rawContent: string;
}
