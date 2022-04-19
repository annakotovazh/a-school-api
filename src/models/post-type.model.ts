import {Entity, model, property} from '@loopback/repository';

@model()
export class PostType extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  postTypeId?: number;

  @property({
    type: 'string',
    required: true,
  })
  postTypeName: string;


  constructor(data?: Partial<PostType>) {
    super(data);
  }
}

export interface PostTypeRelations {
  // describe navigational properties here
}

export type PostTypeWithRelations = PostType & PostTypeRelations;
