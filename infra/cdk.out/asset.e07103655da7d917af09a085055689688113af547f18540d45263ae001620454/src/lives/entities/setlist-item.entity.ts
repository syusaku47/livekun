import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Live } from './live.entity';

@Entity('setlist_items')
export class SetlistItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  order: number;

  @Column()
  title: string;

  @Column({ default: 'song' })
  type: 'song' | 'mc' | 'encore';

  @ManyToOne(() => Live, (live) => live.setlist, { onDelete: 'CASCADE' })
  live: Live;
}
