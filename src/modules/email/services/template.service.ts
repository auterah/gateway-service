import { Injectable, Logger } from '@nestjs/common';
import { EmailRepository } from '../repositories/email.repository';
import { TemplateRepository } from '../repositories/template.repository';
import Template from '../entities/template.entity';
import { FindManyOptions } from 'typeorm';
import { TemplateDto } from '../dtos/template.dto';

@Injectable()
export class TemplateService {
  private logger = new Logger(TemplateService.name);
  constructor(
    private tempRepo: TemplateRepository,
    private emailRepo: EmailRepository,
  ) {}

  create(customerId: string, tempDto: TemplateDto) {
    return this.tempRepo.create({ customerId, ...tempDto });
  }

  findOneById(customerId: string, id: string): Promise<Template> {
    return this.tempRepo.findOne({
      where: { customerId, id },
    });
  }

  findAllRecords(customerId: string, findOpts: FindManyOptions<Template>) {
    return this.tempRepo.findAllRecords(customerId, findOpts);
  }
}
