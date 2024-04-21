import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindOneOptions, FindManyOptions, Repository } from 'typeorm';
import { ClientRepository } from './client.repository';
import Client from './client.entity';
import { BulkClientDto, ClientDto } from './dtos/client.dto';
import { PaginationData } from 'src/shared/types/pagination';
import { ClientUtils } from './utils/client';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepo: ClientRepository) {}

  // Add New Client
  async addClient(clientDto: ClientDto): Promise<Client> {
    const exist = await this.findOneByEmail(clientDto.email);
    if (exist) {
      throw new HttpException(
        'Sorry! Email is unavailable',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.clientRepo.create(clientDto);
  }

  // Add Bulk Clients
  async addBulkClients({ clients }: BulkClientDto): Promise<Client[]> {
    try {
      const newClients: Client[] = [];
      const _clients = ClientUtils.removeDuplicatesByEmail(clients);

      type E = { error: string; client: Client };
      const errors: E[] = [];

      const records: Client[] = (await this.findAllRecords({})).records;
      for (const client of _clients) {
        if (records.find((e: Client) => e.email == client.email)) {
          errors.push({
            error: 'Email already exist',
            client,
          });
        }
        newClients.push(client);
      }

      if (errors.length) {
        throw new HttpException(errors, HttpStatus.EXPECTATION_FAILED);
      }

      return this.repo.save(_clients);
    } catch (e) {
      throw new HttpException(e, HttpStatus.EXPECTATION_FAILED);
    }
  }

  // Find One Client
  findOne(findOpts: FindOneOptions<Client>): Promise<Client> {
    return this.clientRepo.findOne(findOpts);
  }

  // Find Client By Email
  findOneByEmail(email: string): Promise<Client> {
    return this.findOne({
      where: { email },
    });
  }

  // Fetch All Clients
  findAllRecords(findOpts: FindManyOptions<Client>): Promise<PaginationData> {
    return this.clientRepo.findAllRecords(findOpts);
  }

  // Update Client By id
  async updateOneById(id: string, updates: Partial<Client>): Promise<any> {
    const update = await this.clientRepo.updateOneById(id, updates);
    return update;
  }

  get repo(): Repository<Client> {
    return this.clientRepo.repo;
  }
}
