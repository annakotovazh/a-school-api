import {Entity, model, property} from '@loopback/repository';

@model()
export class RegistrationLink extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  registrationLinkId?: number;

  @property({
    type: 'number',
    required: true,
  })
  schoolClassId: number;

  @property({
    type: 'number',
    required: true,
  })
  roleId: number;

  @property({
    type: 'date',
    required: true,
  })
  expireDate: string;

  @property({
    type: 'boolean',
    required: true,
  })
  isActive: boolean;

  @property({
    type: 'string',
    required: true,
  })
  email: string;


  constructor(data?: Partial<RegistrationLink>) {
    super(data);
  }
}

export interface RegistrationLinkRelations {
  // describe navigational properties here
}

export type RegistrationLinkWithRelations = RegistrationLink & RegistrationLinkRelations;
