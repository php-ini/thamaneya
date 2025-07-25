import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { Show } from './entities/show.entity';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { QueryShowDto, SortOrder } from './dto/query-show.dto';

@Injectable()
export class ShowsService {
  constructor(
    @InjectRepository(Show)
    private readonly showRepository: Repository<Show>,
  ) {}

  async create(createShowDto: CreateShowDto): Promise<Show> {
    if (createShowDto.publishDate && typeof createShowDto.publishDate === 'string') {
      createShowDto.publishDate = new Date(createShowDto.publishDate) as any;
    }
    const show = this.showRepository.create(createShowDto);
    return await this.showRepository.save(show);
  }

  async findAll(queryDto: QueryShowDto = {}): Promise<{ data: Show[]; total: number; page: number; limit: number }> {
    const {
      search,
      category,
      language,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
    } = queryDto;

    const queryBuilder = this.showRepository.createQueryBuilder('show');

    // Apply search filter
    if (search) {
      queryBuilder.andWhere(
        '(LOWER(show.title) LIKE LOWER(:search) OR LOWER(show.description) LIKE LOWER(:search))',
        { search: `%${search}%` }
      );
    }

    // Apply category filter
    if (category) {
      queryBuilder.andWhere('show.category = :category', { category });
    }

    // Apply language filter
    if (language) {
      queryBuilder.andWhere('show.language = :language', { language });
    }

    // Apply sorting
    queryBuilder.orderBy(`show.${sortBy}`, sortOrder);

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Show> {
    const show = await this.showRepository.findOne({ where: { id } });
    if (!show) {
      throw new NotFoundException(`Show with ID ${id} not found`);
    }
    return show;
  }

  async update(id: string, updateShowDto: UpdateShowDto): Promise<Show> {
    const show = await this.findOne(id);
    Object.assign(show, updateShowDto);
    return await this.showRepository.save(show);
  }

  async remove(id: string): Promise<void> {
    const show = await this.findOne(id);
    await this.showRepository.remove(show);
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.showRepository
      .createQueryBuilder('show')
      .select('DISTINCT show.category', 'category')
      .where('show.category IS NOT NULL')
      .getRawMany();

    return categories.map(cat => cat.category).filter(Boolean);
  }

  async getLanguages(): Promise<string[]> {
    const languages = await this.showRepository
      .createQueryBuilder('show')
      .select('DISTINCT show.language', 'language')
      .where('show.language IS NOT NULL')
      .getRawMany();

    return languages.map(lang => lang.language).filter(Boolean);
  }

  async searchByFullText(searchTerm: string): Promise<Show[]> {
    return await this.showRepository
      .createQueryBuilder('show')
      .where(
        'to_tsvector(\'english\', show.title || \' \' || COALESCE(show.description, \'\')) @@ plainto_tsquery(\'english\', :searchTerm)',
        { searchTerm }
      )
      .orderBy(
        'ts_rank(to_tsvector(\'english\', show.title || \' \' || COALESCE(show.description, \'\')), plainto_tsquery(\'english\', :searchTerm))',
        'DESC'
      )
      .setParameter('searchTerm', searchTerm)
      .getMany();
  }
} 