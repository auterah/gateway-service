import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindOneOptions, FindManyOptions, Repository } from 'typeorm';
import { ClientRepository } from '../repositories/client.repository';
import Client from '../entities/client.entity';
import { PaginationData } from 'src/shared/types/pagination';
import { ClientUtils } from '../utils/client';
import { CustomerService } from './customer.service';
import Customer from '../entities/customer.entity';
import { ClientDto, BulkClientDto } from '../dtos/client.dto';
import { ClientTagService } from './client_tag.service';
import { CryptoUtil } from 'src/shared/utils/crypto';

type E = { error: string; client: Client };

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepo: ClientRepository,
    // private readonly customerService: CustomerService,
    private readonly tagService: ClientTagService,
  ) {}

  // Add New Client
  async addClient(customer: Customer, clientDto: ClientDto) {
    try {
      const exist = await this.findOneByEmail(clientDto.email);
      if (exist) {
        throw new HttpException(
          'Sorry! Email is unavailable',
          HttpStatus.BAD_REQUEST,
        );
      }
      const tags = clientDto.tags as unknown as string[];
      if (tags) {
        const { errors, tags: _tags } = await this.tagService.findTagsByIds(
          customer.id,
          tags,
          true,
        );

        if (errors.length) {
          throw new HttpException(errors, HttpStatus.EXPECTATION_FAILED);
        }
        clientDto.tags = _tags;
      }

      clientDto.customer = customer;
      clientDto.customerId = customer.id;

      const client = await this.clientRepo.create(clientDto);
      delete client.customer;
      return client;
    } catch (e) {
      throw new HttpException(e, HttpStatus.EXPECTATION_FAILED);
    }
  }

  private async findDuplicateEmails(clients: Client[]) {
    const errors: E[] = [];
    const records: Client[] = (await this.findAllRecords({})).records;

    for (const client of clients) {
      const exist = records.find((e: Client) => e.email == client.email);
      if (exist) {
        errors.push({
          error: 'Email already exist',
          client,
        });
      }
    }

    for (const err of errors) {
      delete err.client.customer;
    }
    return errors;
  }

  private async getTagFromDto(clients: Client[]) {
    let foundTags = [];
    for (const client of clients) {
      const tags = client.tags as unknown as string[];
      foundTags.push(...tags);
    }
    foundTags = Array.from(new Set(foundTags));
    return foundTags;
  }

  private async prepNewClient(customer: Customer, clients: Client[]) {
    const _clients = [];
    for (const client of clients) {
      const foundTags = [];
      const tags = client.tags as unknown as string[];

      for (let index = 0; index < tags.length; index++) {
        const identifier = tags[index];
        const tag = await (CryptoUtil.isUUID(identifier)
          ? this.tagService.findOneById(customer.id, identifier)
          : this.tagService.findOneByName(customer.id, identifier));
        foundTags.push(tag);
      }
      client.customer = customer;
      client.customerId = customer.id;
      client.tags = foundTags;
      _clients.push(client);
    }
    return _clients;
  }

  // Add Bulk Clients
  async addBulkClients(customer: Customer, clientDto: BulkClientDto) {
    try {
      const errors = [];
      const clients = ClientUtils.removeDuplicatesByEmail(clientDto.clients);
      const tags = await this.getTagFromDto(clientDto.clients);
      const dupErr = await this.findDuplicateEmails(clients);
      const foundTags = await this.tagService.findTagsByIds(
        customer.id,
        tags,
        true,
      );

      if (dupErr.length) {
        errors.push(...dupErr);
      }

      if (foundTags.errors.length) {
        errors.push(...foundTags.errors);
      }

      if (errors.length) {
        throw new HttpException(errors, HttpStatus.EXPECTATION_FAILED);
      }
      const newClients = await this.prepNewClient(customer, clients);
      const savedClients = await this.repo.save(newClients);
      for (const client of savedClients) {
        delete client.customer;
      }
      return savedClients;
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
    _return = false,
  ): Promise<void | Client> {
    return this.clientRepo.updateOneById(
      customerId,
      clientId,
      updates,
      _return,
    );
  }

  get repo(): Repository<Client> {
    return this.clientRepo.repo;
  }

  // Assign Tag
  async assignTag(
    customerId: string,
    clientId: string,
    tags: string[],
  ): Promise<Client> {
    try {
      const client = await this.findClientById(customerId, clientId);
      if (!client) {
        throw new HttpException(
          'Invalid Client',
          HttpStatus.EXPECTATION_FAILED,
        );
      }
      const foundTags = await this.tagService.findTagsByIds(
        customerId,
        tags,
        true,
      );
      if (foundTags.errors.length) {
        throw new HttpException(
          foundTags.errors,
          HttpStatus.EXPECTATION_FAILED,
        );
      }
      const newTags = [...client.tags, ...foundTags.tags].filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.id === item.id),
      );
      client.tags = newTags;
      await this.repo.save(client);
      return client;
    } catch (e) {
      throw new HttpException(e, HttpStatus.EXPECTATION_FAILED);
    }
  }
}
