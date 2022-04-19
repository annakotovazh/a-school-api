import {Entity, model, property} from '@loopback/repository';

@model()
export class ClassProfile extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  classProfileId?: number;

  @property({
    type: 'number',
    required: true,
  })
  schoolClassId: number;

  @property({
    type: 'number',
    required: true,
  })
  userProfileId: number;

  @property({
    type: 'number',
    required: true,
  })
  roleId: number;


  constructor(data?: Partial<ClassProfile>) {
    super(data);
  }
}

export interface ClassProfileRelations {
  // describe navigational properties here
}

export type ClassProfileWithRelations = ClassProfile & ClassProfileRelations;
