import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { SeoPageTranslation } from './seo-page-translation.entity';

@Entity('seo_pages')
export class SeoPage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  pageKey: string;

  @Column({ type: 'varchar', nullable: true })
  canonicalUrl: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  noIndex: boolean;

  @Column({ type: 'boolean', default: false })
  noFollow: boolean;

  @OneToMany(() => SeoPageTranslation, (translation) => translation.seoPage, { cascade: true })
  translations: SeoPageTranslation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
