import { EmailsService } from '@lib/emails/emails.service'
import { CheckinEntity, MatchEntity, MembershipEntity, UserJwtPayload } from '@lib/entities'
import { eres } from '@lib/utils'
import { Inject, Injectable, InternalServerErrorException, Logger, UnprocessableEntityException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TeamsService } from 'app/teams/teams.service'
import { Repository } from 'typeorm'
import { CreateCheckinDto } from './dtos/create-checkin.dto'
import { FilterCheckinsDto } from './dtos/filter-checkin.dto'

@Injectable()
export class CheckinsService {
  logger = new Logger(CheckinsService.name)

  constructor(
    @InjectRepository(CheckinEntity)
    private readonly checkinsRepository: Repository<CheckinEntity>,
    @InjectRepository(MatchEntity)
    private readonly matchesRepository: Repository<MatchEntity>,
    @InjectRepository(MembershipEntity)
    private readonly membershipsRepository: Repository<MembershipEntity>,
    @Inject(EmailsService)
    private readonly emailsService: EmailsService,
    @Inject(TeamsService)
    private readonly teamsService: TeamsService,
  ) {}

  private async getCheckin(user: UserJwtPayload, matchId: string): Promise<CheckinEntity> {
    const [error, checkin] = await eres(
      this.checkinsRepository.findOne({
        where: {
          userId: user.id,
          matchId,
        },
        relations: ['user', 'match', 'sector'],
      }),
    )

    if (error || !checkin) {
      this.logger.error(`${CheckinsService.name}[getCheckin - teamId: ${user.teamId}]`, error)
      throw new UnprocessableEntityException('Something went wrong, verify your checkin.')
    }

    return checkin
  }

  private async getMatch(user: UserJwtPayload, matchId: string): Promise<MatchEntity> {
    const [error, match] = await eres(
      this.matchesRepository.findOne({
        where: {
          id: matchId,
          teamId: user.teamId,
        },
      }),
    )

    if (error || !match) {
      this.logger.error(`${CheckinsService.name}[getMatch - teamId: ${user.teamId}]`, error)
      throw new UnprocessableEntityException('Something went wrong, we are looking into it.')
    }

    return match
  }

  private async checkinValidations(user: UserJwtPayload, data: CreateCheckinDto): Promise<void> {
    const [error, checkin] = await eres(
      this.checkinsRepository.findOne({
        where: {
          userId: user.id,
          matchId: data.matchId,
        },
      }),
    )

    if (error || checkin) {
      this.logger.error(`${CheckinsService.name}[checkinValidations - teamId: ${user.teamId}]`, error)
      throw new UnprocessableEntityException('Something went wrong, verify your checkin.')
    }

    await this.getMatch(user, data.matchId)
  }

  private async membershipValidations(userData: UserJwtPayload, sectorId: string): Promise<void> {
    const query = this.membershipsRepository
      .createQueryBuilder('memberships')
      .innerJoinAndSelect('memberships.plan', 'plan')
      .innerJoinAndSelect('plan.sectors', 'sectors')
      .where('memberships.userId = :userId', { userId: userData.id })
      .andWhere('sectors.id IN (:...ids)', { ids: [sectorId] })
      .select(['memberships.id', 'memberships.userId', 'plan.id', 'sectors.id'])

    const [error, membership] = await eres(query.getOne())

    if (error || !membership) {
      this.logger.error(`${CheckinsService.name}[membershipValidations - teamId: ${userData.teamId}]`, error)
      throw new UnprocessableEntityException('You do not have permission for this sector.')
    }
  }

  async sendEmail(user: UserJwtPayload, matchId: string) {
    const team = await this.teamsService.findTeamById(user?.teamId)
    const checkin = await this.getCheckin(user, matchId)

    const mail = {
      to: checkin?.user?.email,
      subject: 'Checkin',
      from: team?.email,
      html: `
      <!DOCTYPE html>
      <html lang="pt-br">
        <head>
          <meta charset="UTF-8" />
          <title>Check-in</title>
          <style>
            /* Definindo as cores */
            body {
              background-color: #f4f4f4;
            }
            .container {
              background-color: #402cf0;
              max-width: 600px;
              padding: 15px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-radius: 4px
            }
            .left {
              float: left;
              margin-right: 20px;
              padding: 20px;
              width: 70%;
            }
            .right { 
              float: right;
              padding: 20px;
              text-align: center;
              width: 25%;
            }
            h2 {
              color: #ffffff;
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 20px;
            }
            p {
              color: #ffffff;
              font-size: 16px;
              margin-bottom: 10px;
            }
            .qr-code {
              margin-top: 20px;
            }
            /* Definindo o estilo do QR code */
            img.qr-code {
              width: 100%;
              max-width: 200px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="left">
              <h2>Check-in</h2>
              <p><strong>Time da casa:</strong> ${checkin?.match?.homeTeam}</p>
              <p><strong>Adversário:</strong> ${checkin?.match?.awayTeam}</p>
              <p><strong>Data e horário:</strong> ${checkin?.match?.startTime}</p>
              <p><strong>Nome:</strong> ${checkin?.user?.name} / ${checkin?.user?.taxId}</p>
              <p><strong>Setor:</strong> ${checkin?.sector?.name}</p>
            </div>
            <div class="right">
              <img class="qr-code" src="https://www.terciostrutzel.com.br/wp-content/uploads/2017/06/QRCode.jpg"/>
              <p>Apresente este QR code na entrada do estádio</p>
            </div>
          </div>
        </body>
      </html>
      `,
    }

    const [errorMail] = await eres(this.emailsService.send(mail))

    if (errorMail) {
      this.logger.error(`${CheckinsService.name}[sendEmail - matchId: ${checkin?.matchId}]`, errorMail)
      //throw new UnprocessableEntityException('Something went wrong when trying to send email.')
    }

    return { message: 'Checkin sent to your registered email.' }
  }

  async create(user: UserJwtPayload, data: CreateCheckinDto) {
    await this.checkinValidations(user, data)

    await this.membershipValidations(user, data.sectorId)

    const newCheckin = this.checkinsRepository.create({ ...data, userId: user.id, checkinTime: new Date() })

    const [error, checkin] = await eres(this.checkinsRepository.save(newCheckin))

    if (error) {
      this.logger.error(`${CheckinsService.name}[create - teamId: ${user.teamId}]`, error)
      throw new UnprocessableEntityException('Something went wrong when trying to create a checkin.')
    }

    await this.sendEmail(user, checkin.matchId)

    return CheckinEntity.convertToPayload(checkin)
  }

  async findAll(matchId: string, filter: FilterCheckinsDto) {
    const query = this.checkinsRepository
      .createQueryBuilder('checkins')
      .leftJoinAndSelect('checkins.user', 'user')
      .leftJoinAndSelect('checkins.match', 'match')
      .leftJoinAndSelect('checkins.sector', 'sector')
      .where('checkins.matchId = :matchId', { matchId })

    if (filter.taxId) query.andWhere('user.taxId ilike :taxId', { taxId: `%${filter.taxId}%` })

    const [error, checkins] = await eres(query.getMany())

    if (error) {
      this.logger.error(`${CheckinsService.name}[findAll - matchId: ${matchId}]`, error)
      throw new UnprocessableEntityException('Something went wrong when trying to find all checkins.')
    }

    return checkins?.map((checkin) => CheckinEntity.convertToPayload(checkin, false))
  }

  async findOne(user: UserJwtPayload, matchId: string) {
    const checkin = await this.getCheckin(user, matchId)

    return CheckinEntity.convertToPayload(checkin)
  }

  async cancel(user: UserJwtPayload, matchId: string): Promise<boolean> {
    const checkin = await this.getCheckin(user, matchId)

    const [error] = await eres(this.checkinsRepository.remove(checkin))

    if (error) throw new InternalServerErrorException('Something went wrong when trying to canel checkin.')

    return true
  }
}
