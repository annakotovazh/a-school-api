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
import {RegistrationLink} from '../models';
import {RegistrationLinkRepository} from '../repositories';

@authenticate('jwt')
@authorize({allowedRoles: ['admin']})
export class RegistrationLinkController {
  constructor(
    @repository(RegistrationLinkRepository)
    public registrationLinkRepository : RegistrationLinkRepository,
  ) {}

  @post('/registration-links')
  @response(200, {
    description: 'RegistrationLink model instance',
    content: {'application/json': {schema: getModelSchemaRef(RegistrationLink)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RegistrationLink, {
            title: 'NewRegistrationLink',
            exclude: ['registrationLinkId'],
          }),
        },
      },
    })
    registrationLink: Omit<RegistrationLink, 'registrationLinkId'>,
  ): Promise<RegistrationLink> {
    return this.registrationLinkRepository.create(registrationLink);
  }

  @get('/registration-links/count')
  @response(200, {
    description: 'RegistrationLink model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(RegistrationLink) where?: Where<RegistrationLink>,
  ): Promise<Count> {
    return this.registrationLinkRepository.count(where);
  }

  @get('/registration-links')
  @response(200, {
    description: 'Array of RegistrationLink model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(RegistrationLink, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(RegistrationLink) filter?: Filter<RegistrationLink>,
  ): Promise<RegistrationLink[]> {
    return this.registrationLinkRepository.find(filter);
  }

  @patch('/registration-links')
  @response(200, {
    description: 'RegistrationLink PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RegistrationLink, {partial: true}),
        },
      },
    })
    registrationLink: RegistrationLink,
    @param.where(RegistrationLink) where?: Where<RegistrationLink>,
  ): Promise<Count> {
    return this.registrationLinkRepository.updateAll(registrationLink, where);
  }

  @get('/registration-links/{id}')
  @response(200, {
    description: 'RegistrationLink model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(RegistrationLink, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(RegistrationLink, {exclude: 'where'}) filter?: FilterExcludingWhere<RegistrationLink>
  ): Promise<RegistrationLink> {
    return this.registrationLinkRepository.findById(id, filter);
  }

  @patch('/registration-links/{id}')
  @response(204, {
    description: 'RegistrationLink PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RegistrationLink, {partial: true}),
        },
      },
    })
    registrationLink: RegistrationLink,
  ): Promise<void> {
    await this.registrationLinkRepository.updateById(id, registrationLink);
  }

  @put('/registration-links/{id}')
  @response(204, {
    description: 'RegistrationLink PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() registrationLink: RegistrationLink,
  ): Promise<void> {
    await this.registrationLinkRepository.replaceById(id, registrationLink);
  }

  @del('/registration-links/{id}')
  @response(204, {
    description: 'RegistrationLink DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.registrationLinkRepository.deleteById(id);
  }
}
