import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {
  AccessRole, UserProfile
} from '../models';
import {UserProfileRepository} from '../repositories';

@authenticate('jwt')
@authorize({allowedRoles: ['admin']})
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
