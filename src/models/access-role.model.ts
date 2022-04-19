import {Entity, model, property} from '@loopback/repository';

@model()
export class AccessRole extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  roleId?: number;

  @property({
    type: 'string',
    required: true,
    length: 50
  })
  roleName: string;


  constructor(data?: Partial<AccessRole>) {
    super(data);
  }
}

export interface AccessRoleRelations {
  // describe navigational properties here
}

export type AccessRoleWithRelations = AccessRole & AccessRoleRelations;
