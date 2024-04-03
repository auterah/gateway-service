import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import Admin from 'src/modules/admin/admin.entity';
import { defaultAdmin } from 'src/database/mocks/default_admins';
import {
  canSendBulkMails,
  canSendSingleMail,
  canTrackOpenMail,
} from 'src/database/mocks/default_permissions';
import Permission from 'src/modules/authorization/permission/permission.entity';
import Role from 'src/modules/authorization/role/role.entity';
import { Roles } from 'src/shared/enums/roles';
import { BootEvents } from 'src/shared/events/local.events';
import { MailEvents } from 'src/shared/events/mail.events';
import { PermissionEvents } from 'src/shared/events/permission.events';
import { RoleEvents } from 'src/shared/events/roles.events';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import App from 'src/modules/app/entities/app.entity';
import { CryptoUtil } from 'src/shared/utils/crypto';
import { defaultApp } from '../mocks/default_app';

@Injectable()
export class SeedingService {
  private logger = new Logger(SeedingService.name);
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
      const appRepository = queryRunner.manager.getRepository(App);

      const apps = await appRepository.find();
      await appRepository.remove(apps);

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

      // -- Seed default app
      const newApp = appRepository.create({
        ...defaultApp,
        scopes: newPerms,
        customer: { email: defaultAdmin.email },
      });
      const app = await appRepository.save(newApp);
      this.seederEvents.emit(BootEvents.CREATED_ADMIN_APP, app);
      // -- End of Seeding default app

      // -- Seed superadmin
      const superAdmin = adminRepository.create(defaultAdmin);
      const salt = await bcrypt.genSalt();
      superAdmin.password = await bcrypt.hash(defaultAdmin.password, salt);
      await adminRepository.save(superAdmin);
      // send otp
      this.seederEvents.emit(MailEvents.PUSH_MAIL, {
        html: `Welcome! Here are the app credentials: <b>
          otp: ${defaultAdmin.otp.toString()} <br>
          password: ${defaultAdmin.password} </b>
          name: ${app.name}
          publicKey: ${app.publicKey}
          `,
        subject: 'Your app is setup 🏁',
        email: defaultAdmin.email,
      });
      // this.seederEvents.emit(
      //   MailEvents.PUSH_MAIL,
      //   optMailTemplate(defaultAdmin.otp.toString(), defaultAdmin.email),
      // );
      // -- End of Seeding superadmin

      await queryRunner.commitTransaction();
      return true;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error seeding default records: ${JSON.stringify(e)}`);
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
