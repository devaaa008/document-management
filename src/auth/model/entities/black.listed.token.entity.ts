import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BlackListedToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;
}
