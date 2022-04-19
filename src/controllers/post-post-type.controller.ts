import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Post,
  PostType,
} from '../models';
import {PostRepository} from '../repositories';

export class PostPostTypeController {
  constructor(
    @repository(PostRepository)
    public postRepository: PostRepository,
  ) { }

  @get('/posts/{id}/post-type', {
    responses: {
      '200': {
        description: 'PostType belonging to Post',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(PostType)},
          },
        },
      },
    },
  })
  async getPostType(
    @param.path.number('id') id: typeof Post.prototype.postId,
  ): Promise<PostType> {
    return this.postRepository.postType(id);
  }
}
