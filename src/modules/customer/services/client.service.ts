import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindOneOptions, FindManyOptions, Repository } from 'typeorm';
import { ClientRepository } from '../repositories/client.repository';
import Client from '../entities/client.entity';
import { PaginationData } from 'src/shared/types/pagination';
import { ClientTagUtils, ClientUtils } from '../utils/client';
import { CustomerService } from './customer.service';
import Customer from '../entities/customer.entity';
import { ClientDto, BulkClientDto } from '../dtos/client.dto';
import { ClientTagService } from './client_tag.service';
import { CryptoUtil } from 'src/shared/utils/crypto';
import { FindDataRequestDto } from 'src/shared/utils/dtos/find.data.request.dto';
import { DateUtils } from 'src/shared/utils/date';
import { StatsResponse } from 'src/shared/types/response';
import { AssignBulkClientTagsDto } from '../dtos/client_tag.dto';
import { ClientSource } from '../enums/client_source.enum';
import { FileType } from 'src/modules/file/types/file';
import { AddEmailList } from '../dtos/add_email_list.dto';
import App from 'src/modules/app/entities/app.entity';

type E = { error: string; client: Client };

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepo: ClientRepository,
    // private readonly customerService: CustomerService,
    private readonly tagService: ClientTagService,
  ) {}

  // Add New Client
  async addClient(app: App, clientDto: ClientDto) {
    try {
      const customer = app.customer;
      const exist = await this.findOneByEmail(customer.id, clientDto.email);
      if (exist) {
        throw new HttpException(
          'Contact already exist',
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
        clientDto.tags.push(..._tags);
      }

      clientDto.customer = customer;
      clientDto.customerId = customer.id;
      clientDto.appId = app.id;

      const client = await this.clientRepo.create(clientDto);
      delete client.customer;
      return client;
    } catch (e) {
      throw new HttpException(e, HttpStatus.EXPECTATION_FAILED);
    }
  }

  private async getUniqueClients(clients: Client[]): Promise<Client[]> {
    const filtrate: Client[] = [];
    const records: Client[] = (await this.findAllRecords({})).records;

    for (const client of clients) {
      const exist = records.find((e: Client) => e.email == client.email);
      if (!exist) {
        filtrate.push(client);
      }
    }
    return filtrate;
  }

  private async getTagFromDto(clients: Client[]) {
    // Todo: Rename to removeClientDuplicateTags
    let foundTags = [];
    for (const client of clients) {
      const tags = client?.tags as unknown as string[];
      tags && foundTags.push(...tags);
    }
    foundTags = Array.from(new Set(foundTags));
    return foundTags;
  }

  private async prepNewClient(app: App, clients: Client[]) {
    const customer = app.customer;
    const _clients = [];
    for (const client of clients) {
      if (client.tags) {
        const foundTags = [];
        const tags = client.tags as unknown as string[];

        for (let index = 0; index < tags.length; index++) {
          const identifier = tags[index];
          const tag = await (CryptoUtil.isUUID(identifier)
            ? this.tagService.findOneById(customer.id, identifier)
            : this.tagService.findOneByName(customer.id, identifier));
          foundTags.push(tag);
        }
        client.tags = foundTags;
      }
      client.customer = customer;
      client.customerId = customer.id;
      client.appId = app.id;
      _clients.push(client);
    }
    return _clients;
  }

  private _attachClientSource(clients: Client[], source: ClientSource) {
    const _clients = [];
    for (let index = 0; index < clients.length; index++) {
      const client = clients[index];
      client.source = source;
      _clients.push(client);
    }
    return _clients;
  }

  // Add Bulk Clients
  async addBulkClients(app: App, clientDto: BulkClientDto) {
    try {
      const errors = [];
      const _clients = this._attachClientSource(
        clientDto.clients,
        clientDto.source,
      );
      const clients = ClientUtils.removeDuplicatesByEmail(_clients);
      const tags = await this.getTagFromDto(_clients);
      const foundTags = await this.tagService.findTagsByIds(
        app.customer.id,
        tags,
        true,
      );

      if (foundTags.errors.length) {
        errors.push(...foundTags.errors);
      }

      if (errors.length) {
        throw new HttpException(errors, HttpStatus.EXPECTATION_FAILED);
      }
      const queue = await this.prepNewClient(app, clients);
      const newClients = await this.getUniqueClients(queue);
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
  findOneByEmail(
    customerId: string,
    email: string,
    relations = [],
  ): Promise<Client> {
    return this.findOne({
      where: { email, customerId },
      relations,
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
  async findClientById(
    customerId: string,
    id: string,
    relations = [],
  ): Promise<Client> {
    return this.clientRepo.findOne({ where: { id, customerId }, relations });
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
      const client = await (CryptoUtil.isUUID(clientId)
        ? this.findClientById(customerId, clientId, ['tags'])
        : this.findOneByEmail(customerId, clientId, ['tags']));

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
      const newTags = [...foundTags.tags];
      if (client.tags) {
        newTags.push(...client.tags);
      }
      newTags.filter(
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

  // Assign Tags To Many
  async assignTagsToMany(
    customerId: string,
    assignDto: AssignBulkClientTagsDto,
  ) {
    try {
      const { clients, errors: clientErrs } =
        await this.clientRepo.findClientsByIds(
          customerId,
          assignDto.clients,
          true,
        );

      const { tags, errors: tagErrs } = await this.tagService.findTagsByIds(
        customerId,
        assignDto.tags,
        true,
      );

      if (assignDto.strict) {
        if (tagErrs.length) {
          throw new HttpException(tagErrs, HttpStatus.EXPECTATION_FAILED);
        }

        if (clientErrs.length) {
          throw new HttpException(clientErrs, HttpStatus.EXPECTATION_FAILED);
        }
      }

      const _clients = [];

      for (const client of clients) {
        client.tags.push(
          ...ClientTagUtils.removeDuplicatesIdentifiers([
            ...client.tags,
            ...tags,
          ]),
        );
        _clients.push(client);
      }

      return this.repo.save(_clients);
    } catch (e) {
      throw new HttpException(e, HttpStatus.EXPECTATION_FAILED);
    }
  }

  // Fetch Client Stats
  fetchClientStatistics(
    customerId: string,
    findOpts: FindDataRequestDto,
  ): Promise<StatsResponse> {
    const isDateRange = findOpts.start_date && findOpts.end_date;
    const startDate =
      isDateRange && DateUtils.parseHyphenatedDate(findOpts.start_date);
    const endDate =
      isDateRange && DateUtils.parseHyphenatedDate(findOpts.end_date);

    const isInvalidDates = startDate || endDate;

    if (isDateRange && !isInvalidDates) {
      throw new HttpException('Invalid date', HttpStatus.BAD_REQUEST);
    }

    return this.clientRepo.countClientsRecords(customerId, findOpts);
  }

  handleClientsUpload(customer: Customer, file: FileType) {
    //todo: handle with queue process
    //  ClientSource.BY_FILE_UPLOAD
  }

  async handleEmailList(app: App, payload: AddEmailList) {
    try {
      const customer = app.customer;
      const appId = app.id;
      const emailRecords = await this.repo.find({
        where: { appId },
        select: ['email'],
      });

      const getDuplicateEmails = (emailList: string[]) => {
        return [...new Set(emailList)];
      }; // todo: Make sure to remove duplicate from both email lists before saving.

      const uniqueEmails = getDuplicateEmails([
        ...payload.emailList,
        ...emailRecords?.map((e) => e.email),
      ]).map((email) => ({ email, customer, appId }));

      if (uniqueEmails.length) {
        // check that no duplicate client
        const clients = await this.repo.save(uniqueEmails);
        for (const client of clients) {
          delete client.customer;
        }
        return clients;
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.EXPECTATION_FAILED);
    }
  }
}
