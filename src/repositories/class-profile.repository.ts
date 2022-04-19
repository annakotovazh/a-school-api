import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {ClassProfile, ClassProfileRelations} from '../models';

export class ClassProfileRepository extends DefaultCrudRepository<
  ClassProfile,
  typeof ClassProfile.prototype.classProfileId,
  ClassProfileRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(ClassProfile, dataSource);
  }
}
