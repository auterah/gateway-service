import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import Customer from './customer.entity';
import { CustomerDto } from './dtos/customer.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RoleService } from '../authorization/role/role.service';
import { CustomerRepository } from './customer.repository';
import { FindOneOptions, FindManyOptions } from 'typeorm';

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepo: CustomerRepository,
    private readonly roleService: RoleService,
    private event: EventEmitter2,
  ) {}

  // Add New Customer
  async addCustomer(customerDto: CustomerDto): Promise<Customer> {
    const exist = await this.findOneByEmail(customerDto.email);
    if (exist) {
      throw new HttpException(
        'Sorry! Email is unavailable',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (customerDto.role) {
      const role = await this.roleService.findOneByRolename(customerDto.role);
      if (!role) {
        throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST);
      }
      customerDto.role = role.role;
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(customerDto.password, salt);
    customerDto.password = hashPassword;
    return this.customerRepo.create(customerDto);
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
  findAllRecords(findOpts: FindManyOptions<Customer>): Promise<any> {
    return this.customerRepo.findAllRecords(findOpts);
  }

  // Update Customer By id
  async updateOneBy(id: string, updates: Partial<Customer>): Promise<any> {
    const update = await this.customerRepo.updateOneBy(id, updates);
    return update;
  }

  async save(customer: Customer): Promise<Customer> {
    return this.customerRepo.save(customer);
  }
}
