import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Announcement extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  announcementId?: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'boolean',
    default: true
  })
  isActive: boolean;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'date',
  })
  dateCreated?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Announcement>) {
    super(data);
  }
}

export interface AnnouncementRelations {
  // describe navigational properties here
}

export type AnnouncementWithRelations = Announcement & AnnouncementRelations;
