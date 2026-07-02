import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Faq } from './faq.entity';
import { Language } from '../../languages/entities/language.entity';

@Entity('faq_translations')
@Unique(['faqId', 'languageId'])
export class FaqTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  faqId: string;

  @Column({ type: 'uuid' })
  languageId: string;

  @ManyToOne(() => Faq, (faq) => faq.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'faqId' })
  faq: Faq;

  @ManyToOne(() => Language, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'languageId' })
  language: Language;

  @Column({ type: 'varchar' })
  question: string;

  @Column({ type: 'text' })
  answer: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
