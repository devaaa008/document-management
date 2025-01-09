import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('blackListedTokens')
export class BlackListedToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;
}
