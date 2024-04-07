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
  addManyTarget(inTargets: Partial<Target>[]): Promise<Target[]> {
    const targets: Partial<Target>[] = [];

    for (const inTarget of inTargets) {
      const newTarget = this.targetRepo.create(inTarget);
      targets.push(newTarget);
    }

    this.logger.debug(`Saved "${targets.length}" targets`);
    return this.targetRepo.save(targets);
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
}
