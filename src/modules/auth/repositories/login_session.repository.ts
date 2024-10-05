import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { calculate_pagination_data } from 'src/shared/utils/pagination';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaginationData } from 'src/shared/types/pagination';
import LoginSession from '../entities/login_session.entity';

@Injectable()
export class LoginSessionRepository {
  private logger = new Logger(LoginSessionRepository.name);
  constructor(
    @InjectRepository(LoginSession)
    private readonly sessionEntity: Repository<LoginSession>,
    public sessionEvent: EventEmitter2,
  ) {}

  // Create LoginSession
  async create(session: Partial<LoginSession>): Promise<LoginSession> {
    const newSession = this.sessionEntity.create(session);
    return this.sessionEntity.save(newSession);
  }

  // FindOne LoginSession
  findOne(findOpts: FindOneOptions<LoginSession>): Promise<LoginSession> {
    return this.sessionEntity.findOne(findOpts);
  }

  // Fetch All LoginSession
  async findAllRecords(
    findOpts: FindManyOptions<LoginSession>,
  ): Promise<PaginationData> {
    const take = Number(findOpts.take || '10');
    const skip = Number(findOpts.skip || '0');

    const records = await this.sessionEntity.findAndCount({
      ...findOpts,
      take,
      skip,
    });
    return calculate_pagination_data(records, skip, take);
  }

  // Delete LoginSession
  async deleteOne(id: string): Promise<boolean> {
    const session = await this.findOne({
      where: { id },
    });
    if (!session) {
      throw new HttpException('Session expired', HttpStatus.BAD_REQUEST);
    }
    await this.sessionEntity.remove(session);
    return true;
  }
}
