import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscoveryController } from './discovery.controller';
import { ShowsService } from '../shows/shows.service';
import { Show } from '../shows/entities/show.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Show])],
  controllers: [DiscoveryController],
  providers: [ShowsService],
  exports: [ShowsService],
})
export class DiscoveryModule {} 