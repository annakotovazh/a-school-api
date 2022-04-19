import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {SchoolClass, SchoolClassRelations} from '../models';

export class SchoolClassRepository extends DefaultCrudRepository<
  SchoolClass,
  typeof SchoolClass.prototype.schoolClassId,
  SchoolClassRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(SchoolClass, dataSource);
  }
}
