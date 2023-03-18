import { ApplicationEntity, ApplicationPayload, TeamEntity, TeamPayload } from '@lib/entities'
import { eres } from '@lib/utils'
import { Injectable, InternalServerErrorException, Logger, UnprocessableEntityException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TeamAppInputDto } from './dtos/create-team-app.dto'
import { TeamInputDto } from './dtos/create-team.dto'

import { v4 as uuidv4 } from 'uuid'
import { generateSecret } from 'libs/generate-password'

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

  async findAll(): Promise<TeamPayload[]> {
    const teams = await this.teamsRepository.find()

    return teams.map((team) => TeamEntity.convertToPayload(team))
  }

  async findTeamById(id: string): Promise<TeamPayload> {
    const [error, team] = await eres(this.teamsRepository.findOne({ where: { id } }))

    if (error || !team) {
      this.logger.error(`${TeamsService.name}[findTeamById - id: ${id}]`, error)

      throw new UnprocessableEntityException('Team not found.')
    }

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
