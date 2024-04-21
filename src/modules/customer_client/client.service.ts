import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindOneOptions, FindManyOptions, Repository } from 'typeorm';
import { ClientRepository } from './client.repository';
import Client from './client.entity';
import { BulkClientDto, ClientDto } from './dtos/client.dto';
import { PaginationData } from 'src/shared/types/pagination';
import { ClientUtils } from './utils/client';
import { CustomerService } from '../customer/customer.service';

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepo: ClientRepository,
    private readonly customerService: CustomerService,
  ) {}

  // Add New Client
  async addClient(customerId: string, clientDto: ClientDto): Promise<Client> {
    const customer = await this.customerService.findOneById(customerId);

    const exist = await this.findOneByEmail(clientDto.email);
    if (exist) {
      throw new HttpException(
        'Sorry! Email is unavailable',
        HttpStatus.BAD_REQUEST,
      );
    }
    const client = await this.clientRepo.create(clientDto);
    client.customer = customer;
    client.customerId = customer.id;
    return client;
  }

  // Add Bulk Clients
  async addBulkClients(
    customerId: string,
    { clients }: BulkClientDto,
  ): Promise<Client[]> {
    try {
      const customer = await this.customerService.findOneById(customerId);

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
        client.customer = customer;
        client.customerId = customer.id;
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

  // Update Client By Id
  async updateOneById(
    customerId: string,
    clientId: string,
    updates: Partial<Client>,
  ): Promise<any> {
    const update = await this.clientRepo.updateOneById(
      customerId,
      clientId,
      updates,
    );
    return update;
  }

  // Find Client By Id
  async findClientById(customerId: string, id: string): Promise<Client> {
    return this.clientRepo.findOne({ where: { id, customerId } });
  }

  // Delete Client By Id
  deleteClient(customerId: string, clientId: string): Promise<boolean> {
    return this.clientRepo.deleteOneById(customerId, clientId);
  }

  // Update Client By Id
  updateClient(
    customerId: string,
    clientId: string,
    updates: Partial<ClientDto>,
  ): Promise<void | Client> {
    return this.clientRepo.updateOneById(customerId, clientId, updates, true);
  }

  get repo(): Repository<Client> {
    return this.clientRepo.repo;
  }
}
