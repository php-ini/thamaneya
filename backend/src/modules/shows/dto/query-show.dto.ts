import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export class QueryShowDto {
  @ApiProperty({ 
    description: 'Search term for title and description', 
    required: false,
    example: 'ancient egypt'
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ 
    description: 'Filter by category', 
    required: false,
    example: 'Documentary'
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ 
    description: 'Filter by language', 
    required: false,
    example: 'English'
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ 
    description: 'Page number for pagination', 
    required: false,
    example: 1,
    minimum: 1
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ 
    description: 'Number of items per page', 
    required: false,
    example: 10,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  limit?: number = 10;

  @ApiProperty({ 
    description: 'Sort by field', 
    required: false,
    example: 'createdAt',
    enum: ['title', 'category', 'language', 'duration', 'publishDate', 'createdAt']
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiProperty({ 
    description: 'Sort order', 
    required: false,
    example: 'DESC',
    enum: SortOrder
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
} 