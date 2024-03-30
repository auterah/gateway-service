import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { calculate_pagination_data } from 'src/shared/utils/pagination';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationData } from 'src/shared/types/pagination';
import { EvemitterService } from 'src/shared/evemitter/evemitter.service';
import Customer from './customer.entity';
import { CustomerDto } from './dtos/customer.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CustomerEvents } from 'src/shared/events/customer.events';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { RoleService } from '../authorization/role/role.service';
import { Roles } from 'src/shared/enums/roles';

@Injectable()
export class CustomerRepository {
  constructor(
    private event: EventEmitter2,
    private customerEvents: EvemitterService<Customer>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    private readonly roleService: RoleService,
  ) {}

  // Add New Customer
  async create(customerDto?: Partial<CustomerDto>): Promise<Customer> {
    if (customerDto && customerDto.role) {
      const role = await this.roleService.findOneByRolename(
        customerDto?.role || Roles.ADMIN,
      );
      if (!role) {
        throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST);
      }
      customerDto.role = role.role;
    }
    const newCustomer = this.customerRepo.create(customerDto);
    const customer = await this.customerRepo.save(newCustomer);
    this.event.emit(CustomerEvents.CREATED, customer);
    return customer;
  }

  // Find Customer
  findOne(findOpts: FindOneOptions<Customer>): Promise<Customer> {
    return this.customerRepo.findOne(findOpts);
  }

  // Find Cutomer By Email
  findOneByEmail(email: string): Promise<Customer> {
    return this.findOne({
      where: { email },
    });
  }

  // Find Unknown(X) Customer By Email
  findXCustomer(findOpts: FindOneOptions<Customer>): Promise<Customer> {
    return this.findOne(findOpts);
  }

  // Fetch All Customers
  async findAllRecords(findOpts: FindManyOptions<Customer>): Promise<any> {
    const take = Number(findOpts.take || '10');
    const skip = Number(findOpts.skip || '0');

    const customers = await this.customerRepo.findAndCount({
      ...findOpts,
      take,
      skip,
      // relations: ['App']
    });
    return calculate_pagination_data(customers, skip, take);
  }

  // Update Customer By id
  updateOneBy(id: string, updates: Partial<Customer>): Promise<any> {
    return this.customerRepo.update({ id }, updates);
  }

  async save(customer: Customer): Promise<Customer> {
    return this.customerRepo.save(customer);
  }
}
