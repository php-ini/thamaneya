import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('shows')
export class Show {
  @ApiProperty({ description: 'Unique identifier for the show' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Title of the show', example: 'The History of Ancient Egypt' })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ description: 'Description of the show', required: false })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Category of the show', example: 'Documentary', required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  category?: string;

  @ApiProperty({ description: 'Language of the show', example: 'English', required: false })
  @Column({ type: 'varchar', length: 50, nullable: true })
  language?: string;

  @ApiProperty({ description: 'Duration in seconds', example: 3600, required: false })
  @Column({ type: 'integer', nullable: true })
  duration?: number;

  @ApiProperty({ description: 'Publish date of the show', required: false })
  @Column({ type: 'timestamp', nullable: true, name: 'publish_date' })
  publishDate?: Date;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 