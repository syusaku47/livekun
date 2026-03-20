import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Live } from './live.entity';

@Entity('photos')
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column({ default: '' })
  mimetype: string;

  @Column({ default: 0 })
  size: number;

  @ManyToOne(() => Live, (live) => live.photos, { onDelete: 'CASCADE' })
  live: Live;

  @CreateDateColumn()
  createdAt: Date;
}
