import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Live } from './live.entity';

@Entity('nearby_facilities')
export class NearbyFacility {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 'izakaya' })
  category: 'izakaya' | 'cafe' | 'other';

  @Column({ default: '' })
  memo: string;

  @ManyToOne(() => Live, (live) => live.nearbyFacilities, {
    onDelete: 'CASCADE',
  })
  live: Live;
}
