import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { calculate_pagination_data } from 'src/shared/utils/pagination';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import App from '../entities/app.entity';
import { CustomerRepository } from 'src/modules/customer/customer.repository';
import { AppDto } from '../dtos/newapp.dto';

@Injectable()
export class AppRepository {
  constructor(
    @InjectRepository(App)
    private readonly appEntity: Repository<App>,
    private readonly customerRepo: CustomerRepository,
  ) {}

  // Create App
  async create(newApp: AppDto): Promise<App> {
    const customer = await this.customerRepo.findOrCreate({
      email: newApp?.email,
    });

    const app = this.appEntity.create({
      customer,
      ...newApp,
    });
    return this.appEntity.save(app);
  }

  // Find Single App
  findOne(findOpts: FindOneOptions<App>): Promise<App> {
    return this.appEntity.findOne(findOpts);
  }

  // Find App By App key
  findOneByPublicKey(publicKey: string): Promise<App> {
    return this.findOne({
      where: { publicKey },
    });
  }

  // Find App By App Name
  findOneByAppName(name: string): Promise<App> {
    return this.findOne({
      where: { name },
    });
  }

  // Find All Apps
  async findAllRecords(findOpts: FindManyOptions<App>): Promise<any> {
    const take = Number(findOpts.take || '10');
    const skip = Number(findOpts.skip || '0');

    const apps = await this.appEntity.findAndCount({
      ...findOpts,
      take,
      skip,
    });
    return calculate_pagination_data(apps, skip, take);
  }

  // Find Unknown(X) App
  findXApp(findOpts: FindOneOptions<App>): Promise<App> {
    return this.findOne(findOpts);
  }

  save(app: Partial<App>): Promise<App> {
    return this.appEntity.save(app);
  }
}
