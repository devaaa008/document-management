import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IngestionStatus } from '../ingestion.status';
import { IngestionPayload } from '../ingestion.payload';

@Entity('ingestionJob')
export class IngestionJobEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  jobId: string;

  @Column('jsonb')
  payload: IngestionPayload;

  @Column()
  status: IngestionStatus;
}
