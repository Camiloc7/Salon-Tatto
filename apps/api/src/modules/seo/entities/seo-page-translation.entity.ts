import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { SeoPage } from './seo-page.entity';
import { Language } from '../../languages/entities/language.entity';

@Entity('seo_page_translations')
@Unique(['seoPageId', 'languageId'])
export class SeoPageTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  seoPageId: string;

  @Column({ type: 'uuid' })
  languageId: string;

  @ManyToOne(() => SeoPage, (page) => page.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seoPageId' })
  seoPage: SeoPage;

  @ManyToOne(() => Language, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'languageId' })
  language: Language;

  @Column({ type: 'varchar', nullable: true })
  title: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', nullable: true })
  ogTitle: string | null;

  @Column({ type: 'text', nullable: true })
  ogDescription: string | null;

  @Column({ type: 'varchar', nullable: true })
  ogImage: string | null;

  @Column({ type: 'varchar', nullable: true })
  keywords: string | null;
}
