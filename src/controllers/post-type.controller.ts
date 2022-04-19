import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {PostType} from '../models';
import {PostTypeRepository} from '../repositories';

export class PostTypeController {
  constructor(
    @repository(PostTypeRepository)
    public postTypeRepository : PostTypeRepository,
  ) {}

  @post('/post-types')
  @response(200, {
    description: 'PostType model instance',
    content: {'application/json': {schema: getModelSchemaRef(PostType)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PostType, {
            title: 'NewPostType',
            exclude: ['postTypeId'],
          }),
        },
      },
    })
    postType: Omit<PostType, 'postTypeId'>,
  ): Promise<PostType> {
    return this.postTypeRepository.create(postType);
  }

  @get('/post-types/count')
  @response(200, {
    description: 'PostType model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(PostType) where?: Where<PostType>,
  ): Promise<Count> {
    return this.postTypeRepository.count(where);
  }

  @get('/post-types')
  @response(200, {
    description: 'Array of PostType model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PostType, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(PostType) filter?: Filter<PostType>,
  ): Promise<PostType[]> {
    return this.postTypeRepository.find(filter);
  }

  @patch('/post-types')
  @response(200, {
    description: 'PostType PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PostType, {partial: true}),
        },
      },
    })
    postType: PostType,
    @param.where(PostType) where?: Where<PostType>,
  ): Promise<Count> {
    return this.postTypeRepository.updateAll(postType, where);
  }

  @get('/post-types/{id}')
  @response(200, {
    description: 'PostType model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PostType, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(PostType, {exclude: 'where'}) filter?: FilterExcludingWhere<PostType>
  ): Promise<PostType> {
    return this.postTypeRepository.findById(id, filter);
  }

  @patch('/post-types/{id}')
  @response(204, {
    description: 'PostType PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PostType, {partial: true}),
        },
      },
    })
    postType: PostType,
  ): Promise<void> {
    await this.postTypeRepository.updateById(id, postType);
  }

  @put('/post-types/{id}')
  @response(204, {
    description: 'PostType PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() postType: PostType,
  ): Promise<void> {
    await this.postTypeRepository.replaceById(id, postType);
  }

  @del('/post-types/{id}')
  @response(204, {
    description: 'PostType DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.postTypeRepository.deleteById(id);
  }
}
