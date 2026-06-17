import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BlogPost } from './blog-post.entity';
import { Language } from '../../languages/entities/language.entity';

@Entity('blog_post_translations')
@Unique(['blogPostId', 'languageId'])
export class BlogPostTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  blogPostId: string;

  @Column({ type: 'uuid' })
  languageId: string;

  @ManyToOne(() => BlogPost, (post) => post.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogPostId' })
  blogPost: BlogPost;

  @ManyToOne(() => Language, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'languageId' })
  language: Language;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text', nullable: true })
  excerpt: string | null;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ type: 'varchar', nullable: true })
  seoTitle: string | null;

  @Column({ type: 'varchar', nullable: true })
  seoDescription: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
