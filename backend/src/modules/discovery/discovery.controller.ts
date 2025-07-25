import { Controller, Get, Query, Param, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ShowsService } from '../shows/shows.service';
import { QueryShowDto } from '../shows/dto/query-show.dto';
import { Show } from '../shows/entities/show.entity';

@ApiTags('discovery')
@Controller('discovery')
export class DiscoveryController {
  constructor(private readonly showsService: ShowsService) {}

  @Get('shows')
  @ApiOperation({ summary: 'Search and discover shows' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for title and description' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiQuery({ name: 'language', required: false, description: 'Filter by language' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', type: Number })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort by field' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order', enum: ['ASC', 'DESC'] })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Shows retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Show' }
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' }
      }
    }
  })
  async searchShows(@Query() queryDto: QueryShowDto) {
    return await this.showsService.findAll(queryDto);
  }

  @Get('shows/:id')
  @ApiOperation({ summary: 'Get show details by ID' })
  @ApiParam({ name: 'id', description: 'Show ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Show details retrieved successfully',
    type: Show 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Show not found' 
  })
  async getShowDetails(@Param('id') id: string): Promise<Show> {
    return await this.showsService.findOne(id);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all available categories for filtering' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Categories retrieved successfully',
    type: [String]
  })
  async getCategories(): Promise<string[]> {
    return await this.showsService.getCategories();
  }

  @Get('languages')
  @ApiOperation({ summary: 'Get all available languages for filtering' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Languages retrieved successfully',
    type: [String]
  })
  async getLanguages(): Promise<string[]> {
    return await this.showsService.getLanguages();
  }

  @Get('search/fulltext')
  @ApiOperation({ summary: 'Full-text search in shows' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Search results retrieved successfully',
    type: [Show]
  })
  async fullTextSearch(@Query('q') query: string): Promise<Show[]> {
    return await this.showsService.searchByFullText(query);
  }
} 