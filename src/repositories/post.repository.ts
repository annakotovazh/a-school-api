import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Post, PostRelations, PostType} from '../models';
import {PostTypeRepository} from './post-type.repository';

export class PostRepository extends DefaultCrudRepository<
  Post,
  typeof Post.prototype.postId,
  PostRelations
> {

  public readonly postType: BelongsToAccessor<PostType, typeof Post.prototype.postId>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('PostTypeRepository') protected postTypeRepositoryGetter: Getter<PostTypeRepository>,
  ) {
    super(Post, dataSource);
    this.postType = this.createBelongsToAccessorFor('postType', postTypeRepositoryGetter,);
    this.registerInclusionResolver('postType', this.postType.inclusionResolver);
  }
}
