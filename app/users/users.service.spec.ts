import { UserEntity } from '@lib/entities'
import { Repository } from 'typeorm'
import { UsersService } from './users.service'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { MockUserRepository, usersMock } from '@lib/utils'
import { EnumGender } from '@lib/enums'
import { InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common'

describe('UsersService', () => {
  let service: UsersService
  let userRepository: Repository<UserEntity>

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(UserEntity),
          useValue: MockUserRepository,
        },
        UsersService,
      ],
    }).compile()

    service = await app.get<UsersService>(UsersService)
    userRepository = app.get<Repository<UserEntity>>(getRepositoryToken(UserEntity))
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
    expect(userRepository).toBeDefined()
  })

  describe('create', () => {
    const data: any = {
      name: 'John Doe',
      email: 'email',
      password: 'password',
      confirmPassword: 'password',
      taxId: '69074164099',
      birthday: '2000-02-11',
      gender: EnumGender.MALE,
    }

    it('should throw an error if user already exists', async () => {
      await service.create(data).catch((error) => {
        expect(error).toBeInstanceOf(UnprocessableEntityException)
        expect(error).toMatchObject({ message: 'User already exists.' })
      })
    })

    it('should throw an error if fail when try to save a new user', async () => {
      const createQueryBuilder: any = {
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }
      jest.spyOn(userRepository, 'createQueryBuilder').mockImplementation(() => createQueryBuilder)

      const data: any = { ...usersMock[0], save: jest.fn().mockRejectedValueOnce(new Error()) }

      jest.spyOn(userRepository, 'create').mockReturnValueOnce(data)

      await service.create(data).catch((error) => {
        expect(error).toBeInstanceOf(InternalServerErrorException)
        expect(error).toMatchObject({ message: 'Something went wrong when trying to create a new user.' })
      })
    })

    it('should create a user', async () => {
      const createQueryBuilder: any = {
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }
      jest.spyOn(userRepository, 'createQueryBuilder').mockImplementation(() => createQueryBuilder)

      const result = await service.create(data)

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

  describe('findAll', () => {
    it('should find all users', async () => {
      const result = await service.findAll()

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            email: expect.any(String),
            taxId: expect.any(String),
            birthday: expect.any(String),
            gender: expect.any(String),
          }),
        ]),
      )
    })
  })

  describe('findOne', () => {
    const userId = 'userId'

    it('should throw an error if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error())

      await service.findOne(userId).catch((error) => {
        expect(error).toBeInstanceOf(UnprocessableEntityException)
        expect(error).toMatchObject({ message: 'User not found.' })
      })
    })

    it('should find one user', async () => {
      const result = await service.findOne(userId)

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

  describe('update', () => {
    const userId = 'userId'
    const data: any = {
      name: 'Eduardo Bernardino',
    }

    it('should throw an error if user already exists', async () => {
      const createQueryBuilder: any = {
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(true),
      }
      jest.spyOn(userRepository, 'createQueryBuilder').mockImplementation(() => createQueryBuilder)

      await service.update(userId, data).catch((error) => {
        expect(error).toBeInstanceOf(UnprocessableEntityException)
        expect(error).toMatchObject({ message: 'User already exists.' })
      })
    })

    it('should throw an error if user not found', async () => {
      const createQueryBuilder: any = {
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }
      jest.spyOn(userRepository, 'createQueryBuilder').mockImplementation(() => createQueryBuilder)
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error())

      await service.update(userId, data).catch((error) => {
        expect(error).toBeInstanceOf(UnprocessableEntityException)
        expect(error).toMatchObject({ message: 'User not found.' })
      })
    })

    it('should throw an error if user cannot update', async () => {
      const createQueryBuilder: any = {
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }
      jest.spyOn(userRepository, 'createQueryBuilder').mockImplementation(() => createQueryBuilder)
      jest.spyOn(userRepository, 'save').mockRejectedValueOnce(new Error())

      await service.update(userId, data).catch((error) => {
        expect(error).toBeInstanceOf(InternalServerErrorException)
        expect(error).toMatchObject({ message: 'Something went wrong when trying to update user.' })
      })
    })

    it('should update a user', async () => {
      const createQueryBuilder: any = {
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }
      jest.spyOn(userRepository, 'createQueryBuilder').mockImplementation(() => createQueryBuilder)

      const result = await service.update(userId, data)

      expect(result).toEqual(
        expect.objectContaining({
          name: expect.any(String),
        }),
      )
    })
  })

  describe('remove', () => {
    const userId = 'userId'

    it('should throw an error if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error())

      await service.remove(userId).catch((error) => {
        expect(error).toBeInstanceOf(UnprocessableEntityException)
        expect(error).toMatchObject({ message: 'User not found.' })
      })
    })

    it('should throw an error if fail when try to save user', async () => {
      jest.spyOn(userRepository, 'remove').mockRejectedValueOnce(new Error())

      await service.remove(userId).catch((error) => {
        expect(error).toBeInstanceOf(InternalServerErrorException)
        expect(error).toMatchObject({ message: 'Something went wrong when trying to remove user.' })
      })
    })

    it('should remove a user', async () => {
      const result = await service.remove(userId)

      expect(result).toBe(true)
    })
  })
})
