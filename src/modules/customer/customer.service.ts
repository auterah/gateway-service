import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { calculate_pagination_data } from 'src/shared/utils/pagination';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationData } from 'src/shared/types/pagination';
import { EvemitterService } from 'src/shared/evemitter/evemitter.service';
import Customer from './customer.entity';
import { CustomerDto } from './dtos/customer.dto';
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { CsutomerEvents } from 'src/shared/events/customer.events';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RoleService } from '../authorization/role/role.service';

@Injectable()
export class CustomerService {
  constructor(
    private customerEvents: EvemitterService<Customer>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    private readonly roleService: RoleService,
    private event: EventEmitter2
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

    const role = await this.roleService.findOneByRolename(customerDto.role);
    if (!role) {
      throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST);
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(customerDto.password, salt);
    customerDto.password = hashPassword;

    const newCustomer = this.customerRepo.create(customerDto);
    newCustomer.roleId = role.id;
    const customer = await this.customerRepo.save(newCustomer);

    // Emit new customer event
    // this.customerEvents.emitEvent<Customer>({
    //   ev: CsutomerEvents.CREATED,
    //   payload: customer,
    // });
    this.event.emit(CsutomerEvents.CREATED, customer);
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
  async updateOneBy(id: string, updates: Partial<Customer>): Promise<any> {
    const status = await this.customerRepo.update({ id }, updates);
    return status;
  }

  async save(customer: Customer): Promise<Customer> {
    return this.customerRepo.save(customer);
  }
}
