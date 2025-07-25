import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CmsController } from './cms.controller';
import { ShowsService } from '../shows/shows.service';
import { Show } from '../shows/entities/show.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Show])],
  controllers: [CmsController],
  providers: [ShowsService],
  exports: [ShowsService],
})
export class CmsModule {} 