import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Tag } from './tag.entity';
import { Language } from '../../languages/entities/language.entity';

@Entity('tag_translations')
@Unique(['tagId', 'languageId'])
export class TagTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tagId: string;

  @Column({ type: 'uuid' })
  languageId: string;

  @ManyToOne(() => Tag, (tag) => tag.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tagId' })
  tag: Tag;

  @ManyToOne(() => Language, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'languageId' })
  language: Language;

  @Column({ type: 'varchar' })
  name: string;
}
