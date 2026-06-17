import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BlogPostTranslation } from './blog-post-translation.entity';
import { Category } from './category.entity';
import { Tag } from './tag.entity';

@Entity('blog_posts')
export class BlogPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', unique: true })
  slug: string;

  @Column({ type: 'varchar', nullable: true })
  featuredImage: string | null;

  @Index()
  @Column({ type: 'varchar', default: 'draft' })
  status: string;

  @Index()
  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  authorId: string | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'authorId' })
  author: User | null;

  @OneToMany(() => BlogPostTranslation, (translation) => translation.blogPost, { cascade: true })
  translations: BlogPostTranslation[];

  @ManyToMany(() => Category)
  @JoinTable({ name: 'blog_post_categories' })
  categories: Category[];

  @ManyToMany(() => Tag)
  @JoinTable({ name: 'blog_post_tags' })
  tags: Tag[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
