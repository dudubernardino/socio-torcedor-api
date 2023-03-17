import { UserEntity } from '@lib/entities'
import { JWTService } from '@lib/jwt'
import { MockUserRepository, usersMock } from '@lib/utils'
import { UnprocessableEntityException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AuthService } from './auth.service'

describe('AuthService', () => {
  let service: AuthService
  let userRepository: Repository<UserEntity>

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(UserEntity),
          useValue: MockUserRepository,
        },
        {
          provide: JWTService,
          useValue: {
            sign: jest.fn().mockReturnValue('signedToken'),
          },
        },
        AuthService,
      ],
    }).compile()

    service = await app.get<AuthService>(AuthService)
    userRepository = app.get<Repository<UserEntity>>(getRepositoryToken(UserEntity))
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
    expect(userRepository).toBeDefined()
  })

  const email = 'email'
  const password = 'password'

  describe('basicCheck', () => {
    it('should throw an error if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error())

      await service.basicCheck({ email, password }).catch((error) => {
        expect(error).toBeInstanceOf(UnprocessableEntityException)
        expect(error).toMatchObject({ message: 'User not found or password is not valid.' })
      })
    })

    it('should throw an error if user password mismatch error', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce({
        ...(usersMock[0] as any),
        validatePassword: jest.fn().mockRejectedValueOnce(new Error()),
      })

      await service.basicCheck({ email, password }).catch((error) => {
        expect(error).toBeInstanceOf(UnprocessableEntityException)
        expect(error).toMatchObject({ message: 'User not found or password is not valid.' })
      })
    })

    it('should throw an error if user password mismatch', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce({ ...(usersMock[0] as any), validatePassword: jest.fn().mockRejectedValueOnce(false) })

      await service.basicCheck({ email, password }).catch((error) => {
        expect(error).toBeInstanceOf(UnprocessableEntityException)
        expect(error).toMatchObject({ message: 'User not found or password is not valid.' })
      })
    })

    it('should return a user', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce({
        ...(usersMock[0] as any),
        validatePassword: jest.fn().mockResolvedValueOnce(true),
      })

      const result = await service.basicCheck({ email, password })

      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          email: expect.any(String),
          taxId: expect.any(String),
          birthday: expect.any(String),
          gender: expect.any(String),
        }),
      )
    })
  })

  describe('login', () => {
    it('should login', async () => {
      jest.spyOn(service, 'basicCheck').mockResolvedValue(usersMock[0] as any)

      const result = await service.login({ email, password })

      expect(result.accessToken).toBeDefined()
    })
  })
})
