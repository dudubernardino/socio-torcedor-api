import { ApplicationEntity, ApplicationPayload, TeamEntity, TeamPayload } from '@lib/entities'
import { eres } from '@lib/utils'
import { Injectable, InternalServerErrorException, Logger, UnprocessableEntityException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TeamAppInputDto } from './dtos/create-team-app.dto'
import { TeamInputDto } from './dtos/create-team.dto'

import { v4 as uuidv4 } from 'uuid'
import { UpdateTeamInputDto } from './dtos/update-team.dto'
import { EntityStatus } from '@lib/enums'
import { FilterTeamDto } from './dtos/filter-team-dto'
import { generateSecret } from '@lib/generate-password'

@Injectable()
export class TeamsService {
  logger = new Logger(TeamsService.name)

  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamsRepository: Repository<TeamEntity>,
    @InjectRepository(ApplicationEntity)
    private readonly applicationRepository: Repository<ApplicationEntity>,
  ) {}

  private async findTeamByEmailOrTaxId(email: string, taxId?: string): Promise<TeamEntity> {
    return this.teamsRepository
      .createQueryBuilder('teams')
      .where('teams.email = :email', { email })
      .orWhere('teams.taxId = :taxId', { taxId })
      .select('teams.id')
      .withDeleted()
      .getOne()
  }

  async create(data: TeamInputDto): Promise<TeamPayload> {
    const [findError, team] = await eres(this.findTeamByEmailOrTaxId(data.email, data.taxId))

    if (findError || team) throw new UnprocessableEntityException('Team already exists.')

    const newTeam = this.teamsRepository.create(data)

    const [error, result] = await eres(newTeam.save())

    if (error) {
      this.logger.error(`${TeamsService.name}[create]`, error)

      throw new InternalServerErrorException('Something went wrong when trying to create a new team.')
    }

    return TeamEntity.convertToPayload(result)
  }

  async findAll(filter: FilterTeamDto): Promise<TeamPayload[]> {
    const query = this.teamsRepository
      .createQueryBuilder('teams')
      .innerJoinAndSelect('teams.users', 'users')
      .leftJoinAndSelect('users.memberships', 'memberships')
      .withDeleted()

    if (filter.name)
      query.where('teams.name ilike :name', {
        name: `%${filter.name}%`,
      })

    if (filter.tradeName)
      query.where('teams.tradeName ilike :tradeName', {
        tradeName: `%${filter.tradeName}%`,
      })

    if (filter.taxId)
      query.where('teams.taxId ilike :taxId', {
        taxId: `%${filter.taxId}%`,
      })

    if (filter.email)
      query.where('teams.email ilike :email', {
        email: `%${filter.email}%`,
      })

    if (filter.status)
      query.where('teams.status = :status', {
        status: filter.status,
      })

    const [error, teams] = await eres(query.getMany())

    if (error) {
      this.logger.error(`${TeamsService.name}[findAll]`, error)

      throw new InternalServerErrorException('Something went wrong when trying to get all teams.')
    }

    return teams.map((team) => TeamEntity.convertToPayload(team))
  }

  async findTeamById(id: string): Promise<TeamEntity> {
    const [error, team] = await eres(this.teamsRepository.findOne({ where: { id }, withDeleted: true }))

    if (error || !team) {
      this.logger.error(`${TeamsService.name}[findTeamById - id: ${id}]`, error)

      throw new UnprocessableEntityException('Team not found.')
    }

    return team
  }

  async findOne(id: string): Promise<TeamPayload> {
    const team = await this.findTeamById(id)

    return TeamEntity.convertToPayload(team)
  }

  private async updateTeamBasicCheck(id: string) {
    const teamAlreadyExists = await this.findTeamByEmailOrTaxId(id)

    if (teamAlreadyExists) throw new UnprocessableEntityException('Team already exists.')
  }

  async update(teamId: string, data: UpdateTeamInputDto): Promise<TeamPayload> {
    await this.updateTeamBasicCheck(teamId)

    const team = await this.findTeamById(teamId)

    const updatedTeam = this.teamsRepository.merge(team, data)

    const [error, result] = await eres(this.teamsRepository.save(updatedTeam))

    if (error) {
      this.logger.error(`${TeamsService.name}[update - id: ${teamId}]`, error)

      throw new InternalServerErrorException('Something went wrong when trying to update team.')
    }

    return TeamEntity.convertToPayload(result)
  }

  async enable(teamId: string): Promise<TeamPayload> {
    const team = await this.findTeamById(teamId)

    team.status = EntityStatus.Active
    team.updatedAt = new Date()
    team.deletedAt = null

    const [error] = await eres(team.save())

    if (error) throw new InternalServerErrorException('Something went wrong when trying to enable team.')

    return TeamEntity.convertToPayload(team)
  }

  async disable(teamId: string): Promise<TeamPayload> {
    const team = await this.findTeamById(teamId)

    team.status = EntityStatus.Inactive
    team.deletedAt = new Date()

    const [error] = await eres(team.save())

    if (error) throw new InternalServerErrorException('Something went wrong when trying to disable team.')

    return TeamEntity.convertToPayload(team)
  }

  async createApplication(teamId: string, data: TeamAppInputDto): Promise<ApplicationPayload> {
    const team = await this.findTeamById(teamId)

    const clientId = uuidv4()
    const secret = generateSecret()

    const newApplication = this.applicationRepository.create({
      ...data,
      teamId: team?.id,
      clientId,
      secret,
    })

    const [error, application] = await eres(this.applicationRepository.save(newApplication))

    if (error) {
      this.logger.error(`${TeamsService.name}[createApplication - teamId: ${teamId}]`, error)

      throw new UnprocessableEntityException('Something went wrong when trying to create a new application.')
    }

    return ApplicationEntity.convertToPayload(application, false)
  }

  async findApplications(teamId: string): Promise<ApplicationPayload[]> {
    const [error, applications] = await eres(this.applicationRepository.find({ where: { teamId } }))

    if (error) throw new UnprocessableEntityException('Something went wrong, we are looking it.')

    return applications.map((application) => ApplicationEntity.convertToPayload(application))
  }
}
