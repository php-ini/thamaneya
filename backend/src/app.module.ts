import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CmsModule } from './modules/cms/cms.module';
import { DiscoveryModule } from './modules/discovery/discovery.module';
import { Show } from './modules/shows/entities/show.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'thamaneya_user',
      password: process.env.DATABASE_PASSWORD || 'thamaneya_password',
      database: process.env.DATABASE_NAME || 'thamaneya',
      entities: [Show],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }),
    CmsModule,
    DiscoveryModule,
  ],
})
export class AppModule {} 