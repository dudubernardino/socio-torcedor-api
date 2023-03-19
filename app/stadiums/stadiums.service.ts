import { Injectable, InternalServerErrorException, Logger, UnprocessableEntityException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, ILike, Repository } from 'typeorm'
import { StadiumEntity, StadiumPayload, StadiumSectorEntity } from '@lib/entities'
import { eres } from '@lib/utils'
import { FilterStadiumsDto } from './dtos/filter-stadiums.dto'
import { CreateStadiumsDto } from './dtos/create-stadium.dto'

@Injectable()
export class StadiumsService {
  private readonly logger = new Logger(StadiumsService.name)

  constructor(
    @InjectRepository(StadiumEntity)
    private readonly stadiumRepository: Repository<StadiumEntity>,
  ) {}

  async stadiumBasicCheck(stadiumName: string) {
    const [error, stadium] = await eres(this.stadiumRepository.findOne({ where: { name: ILike(`%${stadiumName}%`) } }))

    if (error || stadium) {
      this.logger.error(`${StadiumsService.name}[stadiumBasicCheck]`, error)
      throw new UnprocessableEntityException('Stadium already exists.')
    }
  }

  async create(data: CreateStadiumsDto): Promise<StadiumPayload> {
    await this.stadiumBasicCheck(data.name)

    const result = await this.stadiumRepository.manager.transaction(async (manager: EntityManager) => {
      const newStadium = manager.create(StadiumEntity, data)

      const [error, stadium] = await eres(manager.save(StadiumEntity, newStadium))

      if (error) {
        this.logger.error(`${StadiumsService.name}[create]`, error)
        throw new InternalServerErrorException('Something went wrong when trying to create a new stadium.')
      }

      data.sectors.forEach(async (sector) => {
        const newSector = manager.create(StadiumSectorEntity, { ...sector, stadiumId: stadium.id })

        const [error] = await eres(manager.save(StadiumSectorEntity, newSector))

        if (error) {
          this.logger.error(`${StadiumsService.name}[create]`, error)
          throw new InternalServerErrorException('Something went wrong when trying to create a new stadium sector.')
        }
      })

      return stadium
    })

    return StadiumEntity.convertToPayload(result)
  }

  async findAll(filter: FilterStadiumsDto): Promise<StadiumPayload[]> {
    const query = this.stadiumRepository.createQueryBuilder('stadiums').leftJoinAndSelect('stadiums.sectors', 'sectors')

    if (filter.name)
      query.where('stadiums.name ilike :name', {
        name: `%${filter.name}%`,
      })

    const [error, stadiums] = await eres(query.getMany())

    if (error) {
      this.logger.error(`${StadiumsService.name}[findAll]`, error)
      throw new UnprocessableEntityException('Stadiums not found.')
    }

    return stadiums.map((stadium) => StadiumEntity.convertToPayload(stadium))
  }

  async findByStadiumId(stadiumId: string): Promise<StadiumEntity> {
    const [error, stadium] = await eres(
      this.stadiumRepository.findOne({ where: { id: stadiumId }, relations: ['sectors'] }),
    )

    if (error) {
      this.logger.error(`${StadiumsService.name}[findByStadiumId]`, error)
      throw new UnprocessableEntityException('Stadiums not found.')
    }

    return stadium
  }

  async findOne(stadiumId: string): Promise<StadiumPayload> {
    const stadium = await this.findByStadiumId(stadiumId)

    return StadiumEntity.convertToPayload(stadium)
  }
}
