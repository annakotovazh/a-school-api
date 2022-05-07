import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  UserProfile,
  AccessRole,
} from '../models';
import {UserProfileRepository} from '../repositories';

export class UserProfileAccessRoleController {
  constructor(
    @repository(UserProfileRepository)
    public userProfileRepository: UserProfileRepository,
  ) { }

  @get('/user-profiles/{id}/access-role', {
    responses: {
      '200': {
        description: 'AccessRole belonging to UserProfile',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(AccessRole)},
          },
        },
      },
    },
  })
  async getAccessRole(
    @param.path.number('id') id: typeof UserProfile.prototype.userProfileId,
  ): Promise<AccessRole> {
    return this.userProfileRepository.role(id);
  }
}
