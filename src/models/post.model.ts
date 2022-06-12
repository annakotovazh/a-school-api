import {belongsTo, Entity, model, property} from '@loopback/repository';
import {PostType} from './post-type.model';

@model()
export class Post extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  postId: number;

  @property({
    type: 'number',
  })
  schoolClassId?: number;

  @property({
    type: 'number',
  })
  userProfileId?: number;

  @property({
    type: 'string',
  })
  imagePath: string;

  @property({
    type: 'string',
  })
  title?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'date',
  })
  dateCreated?: string;

  @property({
    type: 'date',
  })
  dateUpdated?: string;

  @belongsTo(() => PostType)
  postTypeId?: number;

  constructor(data?: Partial<Post>) {
    super(data);
  }
}

export interface PostRelations {
  // describe navigational properties here
}

export type PostWithRelations = Post & PostRelations;
