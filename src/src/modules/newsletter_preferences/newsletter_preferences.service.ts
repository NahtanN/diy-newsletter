import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SavePreferencesDto } from './dtos/save_preferences.dto';
import { AppService } from 'src/app.service';
import { DataSource, Repository } from 'typeorm';
import { NewsletterPreference } from './entities/newsletter_preference.entity';
import { NewsletterPreferenceConfig } from './entities/newsletter_preference_config.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NewsletterPreferencesService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(NewsletterPreference)
    private readonly newsletterPreferenceRepository: Repository<NewsletterPreference>,
  ) {}

  async findOne(id: number) {
    return await this.newsletterPreferenceRepository.findOne({
      where: {
        id,
      },
      relations: {
        config: true,
      },
    });
  }

  async save(data: SavePreferencesDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    const manager = queryRunner.manager;

    await queryRunner.connect();
    await queryRunner.startTransaction();

    let newsLetterPreferenceId: number;

    try {
      const { id } = await manager.save(NewsletterPreference, {
        title: data.title,
      });

      newsLetterPreferenceId = id;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);

      throw new HttpException('Não foi possível criar a configuração de newsletter.', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const sourceArray = data.sources.map((source) =>
      manager.save(NewsletterPreferenceConfig, {
        title: source.title,
        sourceUrl: source.url,
        newsletterId: newsLetterPreferenceId,
      } as NewsletterPreferenceConfig),
    );

    try {
      await Promise.all(sourceArray);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);

      throw new HttpException(
        'Não foi possível salvar as preferencias da newsletter.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await queryRunner.commitTransaction();

    const newsletterPreference = await this.findOne(newsLetterPreferenceId);

    return {
      message: 'Configuração de newsletter criada com sucesso.',
      newsletterPreference,
    };
  }
}
