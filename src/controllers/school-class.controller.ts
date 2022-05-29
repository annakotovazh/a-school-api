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
import {SchoolClass} from '../models';
import {SchoolClassRepository} from '../repositories';

@authenticate('jwt')
@authorize({allowedRoles: ['admin']})
export class SchoolClassController {
  constructor(
    @repository(SchoolClassRepository)
    public schoolClassRepository : SchoolClassRepository,
  ) {}

  @post('/school-classes')
  @response(200, {
    description: 'SchoolClass model instance',
    content: {'application/json': {schema: getModelSchemaRef(SchoolClass)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SchoolClass, {
            title: 'NewSchoolClass',
            exclude: ['schoolClassId'],
          }),
        },
      },
    })
    schoolClass: Omit<SchoolClass, 'schoolClassId'>,
  ): Promise<SchoolClass> {
    return this.schoolClassRepository.create(schoolClass);
  }

  @get('/school-classes/count')
  @response(200, {
    description: 'SchoolClass model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(SchoolClass) where?: Where<SchoolClass>,
  ): Promise<Count> {
    return this.schoolClassRepository.count(where);
  }

  @get('/school-classes')
  @response(200, {
    description: 'Array of SchoolClass model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SchoolClass, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(SchoolClass) filter?: Filter<SchoolClass>,
  ): Promise<SchoolClass[]> {
    return this.schoolClassRepository.find(filter);
  }

  @patch('/school-classes')
  @response(200, {
    description: 'SchoolClass PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SchoolClass, {partial: true}),
        },
      },
    })
    schoolClass: SchoolClass,
    @param.where(SchoolClass) where?: Where<SchoolClass>,
  ): Promise<Count> {
    return this.schoolClassRepository.updateAll(schoolClass, where);
  }

  @get('/school-classes/{id}')
  @response(200, {
    description: 'SchoolClass model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SchoolClass, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(SchoolClass, {exclude: 'where'}) filter?: FilterExcludingWhere<SchoolClass>
  ): Promise<SchoolClass> {
    return this.schoolClassRepository.findById(id, filter);
  }

  @patch('/school-classes/{id}')
  @response(204, {
    description: 'SchoolClass PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SchoolClass, {partial: true}),
        },
      },
    })
    schoolClass: SchoolClass,
  ): Promise<void> {
    await this.schoolClassRepository.updateById(id, schoolClass);
  }

  @put('/school-classes/{id}')
  @response(204, {
    description: 'SchoolClass PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() schoolClass: SchoolClass,
  ): Promise<void> {
    await this.schoolClassRepository.replaceById(id, schoolClass);
  }

  @del('/school-classes/{id}')
  @response(204, {
    description: 'SchoolClass DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.schoolClassRepository.deleteById(id);
  }
}
