import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {PostType, PostTypeRelations} from '../models';

export class PostTypeRepository extends DefaultCrudRepository<
  PostType,
  typeof PostType.prototype.postTypeId,
  PostTypeRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(PostType, dataSource);
  }
}
