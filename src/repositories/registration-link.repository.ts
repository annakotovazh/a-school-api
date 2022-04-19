import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {RegistrationLink, RegistrationLinkRelations} from '../models';

export class RegistrationLinkRepository extends DefaultCrudRepository<
  RegistrationLink,
  typeof RegistrationLink.prototype.registrationLinkId,
  RegistrationLinkRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(RegistrationLink, dataSource);
  }
}
