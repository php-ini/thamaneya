import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString, MinLength, MaxLength } from 'class-validator';

export class CreateShowDto {
  @ApiProperty({ 
    description: 'Title of the show', 
    example: 'The History of Ancient Egypt',
    minLength: 1,
    maxLength: 255
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @ApiProperty({ 
    description: 'Description of the show', 
    required: false,
    example: 'A comprehensive documentary series exploring the rich history of Ancient Egypt.'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Category of the show', 
    required: false,
    example: 'Documentary',
    enum: ['Documentary', 'Educational', 'Cultural', 'Entertainment']
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiProperty({ 
    description: 'Language of the show', 
    required: false,
    example: 'English',
    enum: ['English', 'Arabic', 'French', 'Spanish']
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  language?: string;

  @ApiProperty({ 
    description: 'Duration in seconds', 
    required: false,
    example: 3600,
    minimum: 1
  })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiProperty({ 
    description: 'Publish date of the show', 
    required: false,
    example: '2024-01-15T10:00:00Z'
  })
  @IsOptional()
  publishDate?: string;
} 