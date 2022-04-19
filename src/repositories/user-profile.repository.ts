import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {UserProfile, UserProfileRelations} from '../models';

export class UserProfileRepository extends DefaultCrudRepository<
  UserProfile,
  typeof UserProfile.prototype.userProfileId,
  UserProfileRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(UserProfile, dataSource);
  }
}
