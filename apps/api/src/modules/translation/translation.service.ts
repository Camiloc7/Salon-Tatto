import { Injectable, Logger } from '@nestjs/common';
import { translate } from '@vitalets/google-translate-api';

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);

  /**
   * Translates text from Spanish to English automatically.
   */
  async translateToEnglish(text: string): Promise<string> {
    if (!text || text.trim() === '') {
      return text;
    }

    try {
      const { text: translatedText } = await translate(text, { from: 'es', to: 'en' });
      return translatedText;
    } catch (error) {
      this.logger.error(`Error translating text: ${text.substring(0, 50)}...`, error);
      // Fallback: return original text if translation fails to not break the application flow
      return text;
    }
  }

  /**
   * Translates an object's string fields from Spanish to English.
   */
  async translateObject<T extends Record<string, any>>(obj: T, fieldsToTranslate: (keyof T)[]): Promise<Partial<T>> {
    const translatedObj: Partial<T> = {};

    for (const field of fieldsToTranslate) {
      const value = obj[field];
      if (typeof value === 'string' && value.trim() !== '') {
        translatedObj[field] = await this.translateToEnglish(value) as any;
      } else {
        translatedObj[field] = value;
      }
    }

    return translatedObj;
  }
}
