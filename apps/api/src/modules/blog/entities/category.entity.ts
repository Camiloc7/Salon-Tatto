import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, ManyToMany } from 'typeorm';
import { CategoryTranslation } from './category-translation.entity';
import { BlogPost } from './blog-post.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @OneToMany(() => CategoryTranslation, (translation) => translation.category, { cascade: true })
  translations: CategoryTranslation[];

  @ManyToMany(() => BlogPost, (post) => post.categories)
  blogPosts: BlogPost[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
