import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index, Unique } from 'typeorm';
import { Artist } from './artist.entity';
import { Language } from '../../languages/entities/language.entity';

@Entity('artist_translations')
@Unique(['artistId', 'languageId'])
@Index(['artistId', 'languageId'], { unique: true })
export class ArtistTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  artistId: string;

  @Column({ type: 'uuid' })
  languageId: string;

  @ManyToOne(() => Artist, (artist) => artist.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'artistId' })
  artist: Artist;

  @ManyToOne(() => Language, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'languageId' })
  language: Language;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  biography: string | null;

  @Column({ type: 'varchar', nullable: true })
  specialty: string | null;

  @Column({ type: 'varchar', nullable: true })
  seoTitle: string | null;

  @Column({ type: 'varchar', nullable: true })
  seoDescription: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
