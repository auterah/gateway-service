import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from './entities/currency.entity';
import { Region } from './entities/region.entity';
import { CurrencyRepository } from './repositories/currency.repository';
import { CurrencyService } from './services/currency.service';
import { CurrencyController } from './controllers/currency.controller';
import { RegionRepository } from './repositories/region.repository';
import { RestcountriesService } from './providers/restcountries.providers';
import { RegionController } from './controllers/region.controller';
import { RegionService } from './services/region.service';
import { RegionFactory } from './factories/region.factory';

@Module({
  imports: [TypeOrmModule.forFeature([Region, Currency])],
  providers: [
    CurrencyRepository,
    CurrencyService,
    RegionRepository,
    RegionService,
    RegionFactory,
    RestcountriesService,
  ],
  controllers: [CurrencyController, RegionController],
})
export class RegionModule {}
