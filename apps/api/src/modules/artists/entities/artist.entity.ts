import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, Index } from 'typeorm';
import { ArtistTranslation } from './artist-translation.entity';
import { ArtistImage } from '../../gallery/entities/artist-image.entity';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', unique: true })
  slug: string;

  @Column({ type: 'varchar', nullable: true })
  avatar: string | null;

  @Column({ type: 'varchar', nullable: true })
  instagramUrl: string | null;

  @Index()
  @Column({ type: 'integer', default: 0 })
  orderIndex: number;

  @Index()
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  @OneToMany(() => ArtistTranslation, (translation) => translation.artist, { cascade: true })
  translations: ArtistTranslation[];

  @OneToMany(() => ArtistImage, (image) => image.artist, { cascade: true })
  images: ArtistImage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
