import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import Customer from '../entities/customer.entity';
import { CustomerDto } from '../dtos/customer.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RoleService } from '../../authorization/role/role.service';
import { CustomerRepository } from '../repositories/customer.repository';
import { FindOneOptions, FindManyOptions } from 'typeorm';
import { CustomerEncryptionDto } from '../dtos/customer_encryption.dto';
import { AesEncryption } from 'src/shared/utils/encryption';
import { configs } from 'config/config.env';

@Injectable()
export class CustomerService {
  private encryption = new AesEncryption(configs.ENCRYPTION_PRIVATE_KEY);

  constructor(
    private readonly customerRepo: CustomerRepository,
    private readonly roleService: RoleService,
    private customerEvent: EventEmitter2,
  ) {}

  // Add New Customer
  async addCustomer(customerDto: CustomerDto): Promise<Customer> {
    const exist = await this.findByEmailOrBusinessName(
      customerDto.email,
      customerDto.businessName,
    );
    if (
      exist?.email == customerDto.email &&
      exist?.businessName == customerDto.businessName
    ) {
      throw new HttpException(
        'Email & Business name already taken',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (exist?.email == customerDto.email) {
      throw new HttpException('Email already taken', HttpStatus.BAD_REQUEST);
    }

    if (exist?.businessName == customerDto.businessName) {
      throw new HttpException(
        'Business name already taken',
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

    // const salt = await bcrypt.genSalt();
    // const hashPassword = await bcrypt.hash(customerDto.password, salt);
    // customerDto.password = hashPassword;
    return this.customerRepo.create(customerDto);
  }

  // Find Customer
  findOne(findOpts: FindOneOptions<Customer>): Promise<Customer> {
    return this.customerRepo.findOne(findOpts);
  }

  // Find Customer By Email
  findOneByEmail(email: string): Promise<Customer> {
    return this.findOne({
      where: { email },
    });
  }

  // Find Customer By Id
  findOneById(id: string): Promise<Customer> {
    return this.findOne({
      where: { id },
    });
  }

  // Find Customer By BusinessName
  findOneByBusinessName(businessName: string): Promise<Customer> {
    return this.findOne({
      where: { businessName },
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

  // Update Customer By email
  updateOneByEmail(email: string, updates: Partial<Customer>): Promise<any> {
    return this.customerRepo.updateOneByEmail(email, updates);
  }

  async save(customer: Customer): Promise<Customer> {
    return this.customerRepo.save(customer);
  }

  // Set Encryption Key
  async setEncryptionKey(
    customer: Customer,
    encryptionDto: CustomerEncryptionDto,
  ): Promise<any> {
    const encryptionKey = this.encryption.encrypt(encryptionDto.encryptionKey);
    await this.updateOneBy(customer.id, { encryptionKey });
    return { serviceMessage: 'Encryption key set successfully' };
  }

  findByEmailOrBusinessName(
    email: string,
    businessName: string,
  ): Promise<Customer> {
    return this.customerRepo.findByEmailOrBusinessName(email, businessName);
  }
}
