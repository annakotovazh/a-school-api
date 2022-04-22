import {Entity, model, property} from '@loopback/repository';

@model()
export class UserProfile extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  userProfileId: number;

  @property({
    type: 'string',
    required: true,
    length: 50
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
    length: 50
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
    length: 100
  })
  email: string;

  @property({
    type: 'string',
    required: true,
    length: 50
  })
  password: string;

  @property({
    type: 'number',
    required: true,
  })
  roleId: string;

  @property({
    type: 'date',
  })
  dateCreated?: string;

  @property({
    type: 'date',
  })
  dateUpdated?: string;


  constructor(data?: Partial<UserProfile>) {
    super(data);
  }
}

export interface UserProfileRelations {
  // describe navigational properties here
}

export type UserProfileWithRelations = UserProfile & UserProfileRelations;
