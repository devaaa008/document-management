import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsString } from 'class-validator';
import { User } from '../../../user/model/entities/user.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description?: string;

  @Column()
  s3Location: string;

  @Column()
  ingested: boolean;

  @ManyToOne(() => User, (user) => user.id)
  createdBy: number;

  @Column()
  createdOn: Date;
}
