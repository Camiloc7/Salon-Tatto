import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, ManyToMany } from 'typeorm';
import { TagTranslation } from './tag-translation.entity';
import { BlogPost } from './blog-post.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @OneToMany(() => TagTranslation, (translation) => translation.tag, { cascade: true })
  translations: TagTranslation[];

  @ManyToMany(() => BlogPost, (post) => post.tags)
  blogPosts: BlogPost[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
