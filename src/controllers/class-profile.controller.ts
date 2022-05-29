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
import {ClassProfile} from '../models';
import {ClassProfileRepository} from '../repositories';

@authenticate('jwt')
@authorize({allowedRoles: ['admin']})
export class ClassProfileController {
  constructor(
    @repository(ClassProfileRepository)
    public classProfileRepository : ClassProfileRepository,
  ) {}

  @post('/class-profiles')
  @response(200, {
    description: 'ClassProfile model instance',
    content: {'application/json': {schema: getModelSchemaRef(ClassProfile)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ClassProfile, {
            title: 'NewClassProfile',
            exclude: ['classProfileId'],
          }),
        },
      },
    })
    classProfile: Omit<ClassProfile, 'classProfileId'>,
  ): Promise<ClassProfile> {
    return this.classProfileRepository.create(classProfile);
  }

  @get('/class-profiles/count')
  @response(200, {
    description: 'ClassProfile model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ClassProfile) where?: Where<ClassProfile>,
  ): Promise<Count> {
    return this.classProfileRepository.count(where);
  }

  @get('/class-profiles')
  @response(200, {
    description: 'Array of ClassProfile model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ClassProfile, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ClassProfile) filter?: Filter<ClassProfile>,
  ): Promise<ClassProfile[]> {
    return this.classProfileRepository.find(filter);
  }

  @patch('/class-profiles')
  @response(200, {
    description: 'ClassProfile PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ClassProfile, {partial: true}),
        },
      },
    })
    classProfile: ClassProfile,
    @param.where(ClassProfile) where?: Where<ClassProfile>,
  ): Promise<Count> {
    return this.classProfileRepository.updateAll(classProfile, where);
  }

  @get('/class-profiles/{id}')
  @response(200, {
    description: 'ClassProfile model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ClassProfile, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ClassProfile, {exclude: 'where'}) filter?: FilterExcludingWhere<ClassProfile>
  ): Promise<ClassProfile> {
    return this.classProfileRepository.findById(id, filter);
  }

  @patch('/class-profiles/{id}')
  @response(204, {
    description: 'ClassProfile PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ClassProfile, {partial: true}),
        },
      },
    })
    classProfile: ClassProfile,
  ): Promise<void> {
    await this.classProfileRepository.updateById(id, classProfile);
  }

  @put('/class-profiles/{id}')
  @response(204, {
    description: 'ClassProfile PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() classProfile: ClassProfile,
  ): Promise<void> {
    await this.classProfileRepository.replaceById(id, classProfile);
  }

  @del('/class-profiles/{id}')
  @response(204, {
    description: 'ClassProfile DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.classProfileRepository.deleteById(id);
  }
}
