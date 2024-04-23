import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import Admin from 'src/modules/admin/admin.entity';
import { defaultAdmin } from 'src/database/mocks/default_admins';
import Permission from 'src/modules/authorization/permission/permission.entity';
import Role from 'src/modules/authorization/role/role.entity';
import { Roles } from 'src/shared/enums/roles';
import { BootEvents } from 'src/shared/events/local.events';
import { PermissionEvents } from 'src/shared/events/permission.events';
import { RoleEvents } from 'src/shared/events/roles.events';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import App from 'src/modules/app/entities/app.entity';
import { defaultApp } from '../mocks/default_app';
import Customer from 'src/modules/customer/entities/customer.entity';
import { defaultPermissions } from '../mocks/default_permissions';
import { AdminEvents } from 'src/shared/events/admin.events';

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
      const customerRepository = queryRunner.manager.getRepository(Customer);

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
      const _permissions = [];
      for (const perm of defaultPermissions) {
        const permission = permissionRepository.create(perm);
        _permissions.push(permission);
      }
      const newPerms = await permissionRepository.save(_permissions);
      this.seederEvents.emit(PermissionEvents.SEEDED, newPerms);
      // -- End of Seeding permissions

      // -- Seed Admin app
      const newCustomer = customerRepository.create({
        email: defaultAdmin.email,
        role: defaultAdmin.role,
      });
      const customer = await customerRepository.save(newCustomer);
      const newApp = appRepository.create({
        ...defaultApp,
        scopes: newPerms,
        customer,
      });
      const app = await appRepository.save(newApp);
      this.seederEvents.emit(BootEvents.ADMIN_APP_IS_SET, app);
      // -- End of Seeding Admin app

      // -- Seed superadmin
      const superAdmin = adminRepository.create(defaultAdmin);
      const salt = await bcrypt.genSalt();
      superAdmin.password = await bcrypt.hash(defaultAdmin.password, salt);
      await adminRepository.save(superAdmin);
      // send otp
      this.seederEvents.emit(AdminEvents.SUPER_ADMIN_CREATED, {
        admin: defaultAdmin,
        app,
      });
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
