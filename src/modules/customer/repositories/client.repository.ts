import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { calculate_pagination_data } from 'src/shared/utils/pagination';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Client from '../entities/client.entity';
import { ClientEvents } from 'src/shared/events/client.events';
import { PaginationData } from 'src/shared/types/pagination';
import { ClientDto } from '../dtos/client.dto';

@Injectable()
export class ClientRepository {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
    public clientEvent: EventEmitter2,
  ) {}

  // Add New Client
  async create(clientDto?: Partial<ClientDto>): Promise<Client> {
    const newClient = this.clientRepo.create(clientDto);
    const _client = await this.clientRepo.save(newClient);
    this.clientEvent.emit(ClientEvents.CREATED, _client);
    return _client;
  }

  async findOrCreate(clientDto: Partial<ClientDto>): Promise<Client> {
    const client = await this.findOne({
      where: { email: clientDto.email },
    });
    if (client) {
      return client;
    }
    return this.create(clientDto);
  }

  // Find Client
  findOne(findOpts: FindOneOptions<Client>): Promise<Client> {
    return this.clientRepo.findOne(findOpts);
  }

  // Fetch All Client
  async findAllRecords(
    findOpts: FindManyOptions<Client>,
  ): Promise<PaginationData> {
    const take = Number(findOpts.take || '10');
    const skip = Number(findOpts.skip || '0');

    const records = await this.clientRepo.findAndCount({
      ...findOpts,
      take,
      skip,
    });
    return calculate_pagination_data(records, skip, take);
  }

  // Update Client By Id
  async updateOneById(
    customerId: string,
    id: string,
    updates: Partial<Client>,
    _return = false,
  ): Promise<void | Client> {
    if (updates.email) {
      const client = await this.clientRepo.findOne({
        where: { email: updates.email },
      });

      if (client) {
        throw new HttpException(
          'Sorry! Email is unavailable',
          HttpStatus.EXPECTATION_FAILED,
        );
      }
    }

    const findOpt = { id, customerId };
    if (!_return) {
      await this.clientRepo.update(findOpt, updates);
      return;
    }
    await this.clientRepo.update(findOpt, updates);
    return this.findOne({ where: findOpt });
  }

  // Remove Client By Id
  async deleteOneById(customerId: string, id: string): Promise<boolean> {
    const client = await this.findOne({ where: { id, customerId } });
    if (!client) {
      throw new HttpException('Invalid client', HttpStatus.EXPECTATION_FAILED);
    }
    await this.clientRepo.remove(client);
    return true;
  }

  get repo(): Repository<Client> {
    return this.clientRepo;
  }
}
