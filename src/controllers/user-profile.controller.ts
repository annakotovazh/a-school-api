import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import * as crypto from 'crypto';
import {UserProfile} from '../models';
import {UserProfileRepository} from '../repositories';

const encrypt = (contents: string) =>
  crypto.createHash('sha256').update(contents).digest('hex');

export class UserProfileController {
  constructor(
    @repository(UserProfileRepository)
    public userProfileRepository: UserProfileRepository,
  ) { }

  @post('/user-profiles')
  @response(200, {
    description: 'UserProfile model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserProfile)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserProfile, {
            title: 'NewUserProfile',
            exclude: ['userProfileId'],
          }),
        },
      },
    })
    userProfile: Omit<UserProfile, 'userProfileId'>,
  ): Promise<UserProfile> {
    if (userProfile.password) {
      const password_hash = encrypt(userProfile.password +
        (process.env.ENCRYPTION_SALT ? process.env.ENCRYPTION_SALT : ''));
      userProfile.password = password_hash;
    }
    return this.userProfileRepository.create(userProfile);
  }
  //
//get all user profiles
  @get('/user-profiles')
  @response(200, {
    description: 'Array of UserProfile model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserProfile, {includeRelations: true}),
        },
      },
    },
  })
  @authenticate('jwt')
    //only admin can get all user profiles
  @authorize({allowedRoles: ['admin']})
  async find(
    @param.filter(UserProfile) filter?: Filter<UserProfile>,
  ): Promise<UserProfile[]> {
    return this.userProfileRepository.find(filter);
  }

  @patch('/user-profiles')
  @response(200, {
    description: 'UserProfile PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authenticate('jwt')
    //only admin can update any user profile
  @authorize({allowedRoles: ['admin']})
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserProfile, {partial: true}),
        },
      },
    })
    userProfile: UserProfile,
    @param.where(UserProfile) where?: Where<UserProfile>,
  ): Promise<Count> {
    if (userProfile.password) {
      const password_hash = encrypt(userProfile.password + (process.env.ENCRYPTION_SALT? process.env.ENCRYPTION_SALT : ''));
      userProfile.password = password_hash;
    }
    return this.userProfileRepository.updateAll(userProfile, where);
  }
//get user profile by id
  @get('/user-profiles/{id}')
  @response(200, {
    description: 'UserProfile model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserProfile, {includeRelations: true}),
      },
    },
  })
    //access allowed only with token
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin', 'teacher', 'parent'], scopes:['id']})
  async findById(
    @param.path.number('id') id: number,
    @param.filter(UserProfile, {exclude: 'where'}) filter?: FilterExcludingWhere<UserProfile>
  ): Promise<UserProfile> {
    return this.userProfileRepository.findById(id, filter);
  }
//update user profile by id
  @patch('/user-profiles/{id}')
  @response(204, {
    description: 'UserProfile PATCH success',
  })
       //access allowed only with token
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin', 'teacher', 'parent'], scopes:['id']})
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserProfile, {partial: true}),
        },
      },
    })
    userProfile: UserProfile,
  ): Promise<void> {
    if (userProfile.password) {
      const password_hash = encrypt(userProfile.password + (process.env.ENCRYPTION_SALT? process.env.ENCRYPTION_SALT : ''));
      userProfile.password = password_hash;
    }
    await this.userProfileRepository.updateById(id, userProfile);
  }
//put user profile by id
  @put('/user-profiles/{id}')
  @response(204, {
    description: 'UserProfile PUT success',
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin']})
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() userProfile: UserProfile,
  ): Promise<void> {
    if (userProfile.password) {
      const password_hash = encrypt(userProfile.password + (process.env.ENCRYPTION_SALT? process.env.ENCRYPTION_SALT : ''));
      userProfile.password = password_hash;
    }
    await this.userProfileRepository.replaceById(id, userProfile);
  }
//delete user profile by id
  @del('/user-profiles/{id}')
  @response(204, {
    description: 'UserProfile DELETE success',
  })
  @authenticate('jwt')
    //only admin can delete any user profile
  @authorize({allowedRoles: ['admin']})
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userProfileRepository.deleteById(id);
  }

}

