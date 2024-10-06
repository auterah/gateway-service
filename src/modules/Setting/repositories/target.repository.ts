import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import Target from '../entities/target.entity';

@Injectable()
export class TargetRepository {
  private logger = new Logger(TargetRepository.name);
  constructor(
    private event: EventEmitter2,
    @InjectRepository(Target)
    private readonly targetRepo: Repository<Target>,
  ) {}

  // Add Target
  addTarget(inTarget: Partial<Target>): Promise<Target> {
    const newTarget = this.targetRepo.create(inTarget);
    return this.targetRepo.save(newTarget);
  }

  // Add Many Target
  async addManyTarget(inTargets: Partial<Target>[]): Promise<void> {
    const targets: Partial<Target>[] = [];

    for (const inTarget of inTargets) {
      const newTarget = this.targetRepo.create(inTarget);
      targets.push(newTarget);
    }

    this.logger.verbose(`Saving "${targets.length}" targets`);
    this.targetRepo.insert(targets);
  }

  // Find Target
  findOne(findOpts: FindOneOptions<Target>): Promise<Target> {
    return this.targetRepo.findOne(findOpts);
  }

  // Fetch All Targets
  async findAllRecords(
    findOpts: FindManyOptions<Target>,
  ): Promise<{ records: any[]; totalItems: number }> {
    const records = await this.targetRepo.findAndCount(findOpts);
    return {
      records: records[0],
      totalItems: records[1],
    };
  }

  async emptyTable(): Promise<boolean> {
    try {
      await this.targetRepo.clear();
      this.logger.verbose('Cleared Targets table');
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
