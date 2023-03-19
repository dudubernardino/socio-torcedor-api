import { MatchEntity, MatchPayload, TeamEntity } from '@lib/entities'
import { eres } from '@lib/utils'
import { Injectable, InternalServerErrorException, Logger, UnprocessableEntityException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MatchInputDto } from './dtos/create-match.dto'
import { UpdateMatchDto } from './dtos/update-match.dto'

@Injectable()
export class MatchesService {
  logger = new Logger(MatchesService.name)

  constructor(
    @InjectRepository(MatchEntity)
    private readonly matchesRepository: Repository<MatchEntity>,
    @InjectRepository(TeamEntity)
    private readonly teamsRepository: Repository<TeamEntity>,
  ) {}

  async findTeamById(id: string): Promise<TeamEntity> {
    const [error, team] = await eres(this.teamsRepository.findOne({ where: { id }, withDeleted: true }))

    if (error || !team) {
      this.logger.error(`${MatchesService.name}[findTeamById - id: ${id}]`, error)

      throw new UnprocessableEntityException('Team not found.')
    }

    return team
  }

  async create(teamId: string, data: MatchInputDto): Promise<MatchPayload> {
    const team = await this.findTeamById(teamId)

    const newMatch = this.matchesRepository.create({ ...data, teamId: team.id })

    const [error, result] = await eres(newMatch.save())

    if (error) {
      this.logger.error(`${MatchesService.name}[create]`, error)

      throw new InternalServerErrorException('Something went wrong when trying to create a new match.')
    }

    return MatchEntity.convertToPayload(result)
  }

  async findAll(teamId: string): Promise<MatchPayload[]> {
    const query = this.matchesRepository.createQueryBuilder('matches').innerJoinAndSelect('matches.stadium', 'stadium')

    if (teamId) query.where('matches.teamId = :teamId', { teamId })

    const [error, matches] = await eres(query.getMany())

    if (error) {
      this.logger.error(`${MatchesService.name}[findAll - teamId: ${teamId}]`, error)

      throw new UnprocessableEntityException('Matches not found.')
    }

    return matches.map((match) => MatchEntity.convertToPayload(match))
  }

  async findMatchById(teamId: string, matchId: string): Promise<MatchEntity> {
    const query = this.matchesRepository
      .createQueryBuilder('matches')
      .where('matches.id = :id', { id: matchId })
      .innerJoinAndSelect('matches.stadium', 'stadium')

    if (teamId) query.andWhere('matches.teamId = :teamId', { teamId })

    const [error, match] = await eres(query.getOne())

    if (error || !match) {
      this.logger.error(`${MatchesService.name}[findMatchById - teamId: ${teamId}]`, error)

      throw new UnprocessableEntityException('Match not found.')
    }

    return match
  }

  async findOne(teamId: string, matchId: string): Promise<MatchPayload> {
    const match = await this.findMatchById(teamId, matchId)

    return MatchEntity.convertToPayload(match)
  }

  async update(teamId: string, matchId: string, data: UpdateMatchDto): Promise<MatchPayload> {
    const match = await this.findMatchById(teamId, matchId)

    const updatedMatch = this.matchesRepository.merge(match, data)

    const [error, result] = await eres(this.matchesRepository.save(updatedMatch))

    if (error) {
      this.logger.error(`${MatchesService.name}[update - id: ${matchId}]`, error)

      throw new InternalServerErrorException('Something went wrong when trying to update match.')
    }

    return MatchEntity.convertToPayload(result)
  }
}
