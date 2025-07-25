import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ShowsService } from '../shows/shows.service';
import { CreateShowDto } from '../shows/dto/create-show.dto';
import { UpdateShowDto } from '../shows/dto/update-show.dto';
import { QueryShowDto } from '../shows/dto/query-show.dto';
import { Show } from '../shows/entities/show.entity';

@ApiTags('cms')
@Controller('cms/shows')
export class CmsController {
  constructor(private readonly showsService: ShowsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new show' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Show created successfully',
    type: Show 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid input data' 
  })
  async create(@Body() createShowDto: CreateShowDto): Promise<Show> {
    return await this.showsService.create(createShowDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shows with pagination and filtering' })
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
  async findAll(@Query() queryDto: QueryShowDto) {
    return await this.showsService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a show by ID' })
  @ApiParam({ name: 'id', description: 'Show ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Show retrieved successfully',
    type: Show 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Show not found' 
  })
  async findOne(@Param('id') id: string): Promise<Show> {
    return await this.showsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a show' })
  @ApiParam({ name: 'id', description: 'Show ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Show updated successfully',
    type: Show 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Show not found' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid input data' 
  })
  async update(@Param('id') id: string, @Body() updateShowDto: UpdateShowDto): Promise<Show> {
    return await this.showsService.update(id, updateShowDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a show' })
  @ApiParam({ name: 'id', description: 'Show ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Show deleted successfully' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Show not found' 
  })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.showsService.remove(id);
  }

  @Get('categories/list')
  @ApiOperation({ summary: 'Get all available categories' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Categories retrieved successfully',
    type: [String]
  })
  async getCategories(): Promise<string[]> {
    return await this.showsService.getCategories();
  }

  @Get('languages/list')
  @ApiOperation({ summary: 'Get all available languages' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Languages retrieved successfully',
    type: [String]
  })
  async getLanguages(): Promise<string[]> {
    return await this.showsService.getLanguages();
  }
} 