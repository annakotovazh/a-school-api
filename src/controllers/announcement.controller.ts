import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Announcement} from '../models';
import {AnnouncementRepository} from '../repositories';

@authenticate('jwt')
export class AnnouncementController {
  constructor(
    @repository(AnnouncementRepository)
    public announcementRepository : AnnouncementRepository,
  ) {}

  @post('/announcements')
  @response(200, {
    description: 'Announcement model instance',
    content: {'application/json': {schema: getModelSchemaRef(Announcement)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Announcement, {
            title: 'NewAnnouncement',
            exclude: ['announcementId'],
          }),
        },
      },
    })
    announcement: Omit<Announcement, 'announcementId'>,
  ): Promise<Announcement> {
    return this.announcementRepository.create(announcement);
  }

  @get('/announcements/count')
  @response(200, {
    description: 'Announcement model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Announcement) where?: Where<Announcement>,
  ): Promise<Count> {
    return this.announcementRepository.count(where);
  }

  @get('/announcements')
  @response(200, {
    description: 'Array of Announcement model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Announcement, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Announcement) filter?: Filter<Announcement>,
  ): Promise<Announcement[]> {
    return this.announcementRepository.find(filter);
  }

  @patch('/announcements')
  @response(200, {
    description: 'Announcement PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Announcement, {partial: true}),
        },
      },
    })
    announcement: Announcement,
    @param.where(Announcement) where?: Where<Announcement>,
  ): Promise<Count> {
    return this.announcementRepository.updateAll(announcement, where);
  }

  @get('/announcements/{id}')
  @response(200, {
    description: 'Announcement model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Announcement, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Announcement, {exclude: 'where'}) filter?: FilterExcludingWhere<Announcement>
  ): Promise<Announcement> {
    return this.announcementRepository.findById(id, filter);
  }

  @patch('/announcements/{id}')
  @response(204, {
    description: 'Announcement PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Announcement, {partial: true}),
        },
      },
    })
    announcement: Announcement,
  ): Promise<void> {
    await this.announcementRepository.updateById(id, announcement);
  }

  @put('/announcements/{id}')
  @response(204, {
    description: 'Announcement PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() announcement: Announcement,
  ): Promise<void> {
    await this.announcementRepository.replaceById(id, announcement);
  }

  @del('/announcements/{id}')
  @response(204, {
    description: 'Announcement DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.announcementRepository.deleteById(id);
  }
}
