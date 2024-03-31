import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import Admin from 'src/modules/admin/admin.entity';
import { defaultAdmin } from 'src/modules/admin/constants/default_admins';
import {
  canSendBulkMails,
  canSendSingleMail,
  canTrackOpenMail,
} from 'src/modules/authorization/constants/default_permissions';
import Permission from 'src/modules/authorization/permission/permission.entity';
import Role from 'src/modules/authorization/role/role.entity';
import { optMailTemplate } from 'src/modules/email/templates/auth';
import { Roles } from 'src/shared/enums/roles';
import { BootEvents } from 'src/shared/events/local.events';
import { MailEvents } from 'src/shared/events/mail.events';
import { PermissionEvents } from 'src/shared/events/permission.events';
import { RoleEvents } from 'src/shared/events/roles.events';
import { DataSource } from 'typeorm';

@Injectable()
export class SeedingService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly seederEvents: EventEmitter2,
  ) {}

  @OnEvent(BootEvents.SEED_DATABASE)
  async seedApp(): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const roleRepository = queryRunner.manager.getRepository(Role);
      const permissionRepository =
        queryRunner.manager.getRepository(Permission);
      const adminRepository = queryRunner.manager.getRepository(Admin);

      const roles = await roleRepository.find();
      await roleRepository.remove(roles);

      const permissions = await permissionRepository.find();
      await permissionRepository.remove(permissions);

      const admins = await adminRepository.find();
      await adminRepository.remove(admins);

      // -- Seed roles
      const role1 = roleRepository.create({ role: Roles.ADMIN });
      const role2 = roleRepository.create({ role: Roles.SUPER_ADMIN });

      const newRoles = await roleRepository.save([role1, role2]);
      this.seederEvents.emit(RoleEvents.SEEDED, newRoles);
      // -- End of Seeding roles

      // -- Seed permissions
      const perm1 = permissionRepository.create(canSendSingleMail);
      const perm2 = permissionRepository.create(canSendBulkMails);
      const perm3 = permissionRepository.create(canTrackOpenMail);

      const newPerms = await permissionRepository.save([perm1, perm2, perm3]);
      this.seederEvents.emit(PermissionEvents.SEEDED, newPerms);
      // -- End of Seeding permissions

      // -- Seed superadmin
      const superAdmin = adminRepository.create(defaultAdmin);

      await adminRepository.save(superAdmin);
      // send otp
      this.seederEvents.emit(
        MailEvents.PUSH_MAIL,
        optMailTemplate(defaultAdmin.otp.toString(), defaultAdmin.email),
      );
      // -- End of Seeding superadmin

      await queryRunner.commitTransaction();
      return true;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
