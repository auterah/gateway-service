import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { calculate_pagination_data } from 'src/shared/utils/pagination';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Client from '../entities/client.entity';
import { ClientEvents } from 'src/shared/events/client.events';
import { PaginationData } from 'src/shared/types/pagination';
import { ClientDto } from '../dtos/client.dto';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { StatsResponse } from 'src/shared/types/response';
import { format } from 'date-fns';
import { CryptoUtil } from 'src/shared/utils/crypto';
import { ClientUtils } from '../utils/client';
import { ArrayUtils } from 'src/shared/utils/array';

type E = { error: string; client: string };

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
    { verified, tags, ...updates }: Partial<Client>,
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

  async countClientsRecords(customerId: string, findOpts: FindDataRequestDto) {
    const query = this.clientRepo
      .createQueryBuilder('customer_clients')
      .select('COUNT(*)', 'count')
      .where('customer_id = :customerId', { customerId });

    if (findOpts.start_date && findOpts.end_date) {
      query
        .andWhere('client_tags.createdAt >= :startDate', {
          startDate: format(findOpts.start_date, 'yyyy-MM-dd'),
        })
        .andWhere('client_tags.createdAt <= :endDate', {
          endDate: format(findOpts.end_date, 'yyyy-MM-dd'),
        });
    }

    const statistics = await query.getRawOne();
    return {
      totalCount: Number(statistics?.count || '0'),
    };
  }

  get repo(): Repository<Client> {
    return this.clientRepo;
  }

  // FindOne Client By Id
  findOneById(customerId: string, id: string, relations = []): Promise<Client> {
    return this.clientRepo.findOne({
      where: { id, customerId },
      relations,
    });
  }

  // FindOne Client By Email
  findOneByEmail(
    customerId: string,
    email: string,
    relations = []
  ): Promise<Client> {
    return this.findOne({
      where: { email, customerId },
      relations,
    });
  }

  // Fetch Clients By Ids
  async findClientsByIds(
    customerId: string,
    clientIdentifiers: string[],
    vetRecords = false,
  ): Promise<{ errors: E[]; clients: Client[] }> {
    const errors: E[] = [];
    const clients: Client[] = [];
    const ids = ArrayUtils.removeDuplicates(clientIdentifiers);

    try {
      for (const id of ids) {
        const client = await (CryptoUtil.isUUID(id)
          ? this.findOneById(customerId, id, ['tags'])
          : this.findOneByEmail(customerId, id, ['tags']));

        if (vetRecords && !client) {
          errors.push({
            error: 'Invaild Client',
            client: id,
          });
        }

        if (client) {
          clients.push(client);
        }
      }

      return {
        errors,
        clients,
      };
    } catch (e) {
      throw new HttpException(e, HttpStatus.EXPECTATION_FAILED);
    }
  }
}
