import {authenticate} from '@loopback/authentication';
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
import {AccessRole} from '../models';
import {AccessRoleRepository} from '../repositories';

@authenticate('jwt')
export class AccessRoleController {
  constructor(
    @repository(AccessRoleRepository)
    public accessRoleRepository : AccessRoleRepository,
  ) {}

  @post('/access-roles')
  @response(200, {
    description: 'AccessRole model instance',
    content: {'application/json': {schema: getModelSchemaRef(AccessRole)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AccessRole, {
            title: 'NewAccessRole',
            exclude: ['roleId'],
          }),
        },
      },
    })
    accessRole: Omit<AccessRole, 'roleId'>,
  ): Promise<AccessRole> {
    return this.accessRoleRepository.create(accessRole);
  }

  @get('/access-roles/count')
  @response(200, {
    description: 'AccessRole model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(AccessRole) where?: Where<AccessRole>,
  ): Promise<Count> {
    return this.accessRoleRepository.count(where);
  }

  @get('/access-roles')
  @response(200, {
    description: 'Array of AccessRole model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(AccessRole, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(AccessRole) filter?: Filter<AccessRole>,
  ): Promise<AccessRole[]> {
    return this.accessRoleRepository.find(filter);
  }

  @patch('/access-roles')
  @response(200, {
    description: 'AccessRole PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AccessRole, {partial: true}),
        },
      },
    })
    accessRole: AccessRole,
    @param.where(AccessRole) where?: Where<AccessRole>,
  ): Promise<Count> {
    return this.accessRoleRepository.updateAll(accessRole, where);
  }

  @get('/access-roles/{id}')
  @response(200, {
    description: 'AccessRole model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(AccessRole, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(AccessRole, {exclude: 'where'}) filter?: FilterExcludingWhere<AccessRole>
  ): Promise<AccessRole> {
    return this.accessRoleRepository.findById(id, filter);
  }

  @patch('/access-roles/{id}')
  @response(204, {
    description: 'AccessRole PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AccessRole, {partial: true}),
        },
      },
    })
    accessRole: AccessRole,
  ): Promise<void> {
    await this.accessRoleRepository.updateById(id, accessRole);
  }

  @put('/access-roles/{id}')
  @response(204, {
    description: 'AccessRole PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() accessRole: AccessRole,
  ): Promise<void> {
    await this.accessRoleRepository.replaceById(id, accessRole);
  }

  @del('/access-roles/{id}')
  @response(204, {
    description: 'AccessRole DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.accessRoleRepository.deleteById(id);
  }
}
