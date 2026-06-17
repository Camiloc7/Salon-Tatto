import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Category } from './category.entity';
import { Language } from '../../languages/entities/language.entity';

@Entity('category_translations')
@Unique(['categoryId', 'languageId'])
export class CategoryTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  categoryId: string;

  @Column({ type: 'uuid' })
  languageId: string;

  @ManyToOne(() => Category, (category) => category.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToOne(() => Language, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'languageId' })
  language: Language;

  @Column({ type: 'varchar' })
  name: string;
}
