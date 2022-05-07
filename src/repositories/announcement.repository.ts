import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Announcement, AnnouncementRelations} from '../models';

export class AnnouncementRepository extends DefaultCrudRepository<
  Announcement,
  typeof Announcement.prototype.announcementId,
  AnnouncementRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Announcement, dataSource);
  }
}
