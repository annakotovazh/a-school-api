import {Entity, model, property} from '@loopback/repository';

@model()
export class SchoolClass extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  schoolClassId?: number;

  @property({
    type: 'string',
    required: true,
  })
  schoolClassName: string;


  constructor(data?: Partial<SchoolClass>) {
    super(data);
  }
}

export interface SchoolClassRelations {
  // describe navigational properties here
}

export type SchoolClassWithRelations = SchoolClass & SchoolClassRelations;
