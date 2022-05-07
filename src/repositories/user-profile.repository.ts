import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {UserProfile, UserProfileRelations, AccessRole} from '../models';
import {AccessRoleRepository} from './access-role.repository';

export class UserProfileRepository extends DefaultCrudRepository<
  UserProfile,
  typeof UserProfile.prototype.userProfileId,
  UserProfileRelations
> {

  public readonly role: BelongsToAccessor<AccessRole, typeof UserProfile.prototype.userProfileId>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('AccessRoleRepository') protected accessRoleRepositoryGetter: Getter<AccessRoleRepository>,
  ) {
    super(UserProfile, dataSource);
    this.role = this.createBelongsToAccessorFor('role', accessRoleRepositoryGetter,);
    this.registerInclusionResolver('role', this.role.inclusionResolver);
  }
}
