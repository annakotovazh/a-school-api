import {belongsTo, Entity, model, property} from '@loopback/repository';
import {AccessRole} from './access-role.model';

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
    type: 'date',
  })
  dateCreated?: string;

  @property({
    type: 'date',
  })
  dateUpdated?: string;

  @belongsTo(() => AccessRole)
  roleId: number;

  constructor(data?: Partial<UserProfile>) {
    super(data);
  }
}

export interface UserProfileRelations {
  role?: AccessRole;
}

export type UserProfileWithRelations = UserProfile & UserProfileRelations;
