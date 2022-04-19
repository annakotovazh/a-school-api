import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {AccessRole, AccessRoleRelations} from '../models';

export class AccessRoleRepository extends DefaultCrudRepository<
  AccessRole,
  typeof AccessRole.prototype.roleId,
  AccessRoleRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(AccessRole, dataSource);
  }
}
