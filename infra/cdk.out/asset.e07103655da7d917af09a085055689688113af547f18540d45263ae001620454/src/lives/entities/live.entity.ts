import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { SetlistItem } from './setlist-item.entity';
import { NearbyFacility } from './nearby-facility.entity';
import { Photo } from './photo.entity';

@Entity('lives')
export class Live {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  artistName: string;

  @Column({ type: 'date' })
  performanceDate: string;

  @Column()
  venueName: string;

  @Column({ default: '' })
  tourName: string;

  @Column({ default: '' })
  startTime: string;

  @Column({ default: '' })
  endTime: string;

  @Column({ default: '' })
  googleMapUrl: string;

  @Column({ type: 'text', default: '' })
  impression: string;

  @OneToMany(() => SetlistItem, (item) => item.live, {
    cascade: true,
    eager: true,
  })
  setlist: SetlistItem[];

  @OneToMany(() => NearbyFacility, (facility) => facility.live, {
    cascade: true,
    eager: true,
  })
  nearbyFacilities: NearbyFacility[];

  @OneToMany(() => Photo, (photo) => photo.live, {
    cascade: true,
    eager: true,
  })
  photos: Photo[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
