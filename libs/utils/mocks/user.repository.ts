export const usersMock = [
  {
    id: '7665ecd4-1bb8-42a0-8b1e-54a60f4cd969',
    name: 'John DOe',
    email: 'john@org.com',
    taxId: '690.***.***-99',
    birthday: '2022-03-15T00:00:00.000Z',
    gender: 'MALE',
    cellPhone: '85991100754',
    createdAt: '2023-03-17T09:51:28.752Z',
    updatedAt: '2023-03-17T09:56:22.973Z',
  },
]

export const MockUserRepository = {
  find: jest.fn().mockResolvedValue(usersMock),
  findOne: jest.fn().mockResolvedValue(usersMock[0]),
  create: jest.fn().mockReturnValue({ ...usersMock[0], save: jest.fn().mockResolvedValue(usersMock[0]) }),
  merge: jest.fn().mockReturnValue(usersMock[0]),
  save: jest.fn().mockResolvedValue(usersMock[0]),
  remove: jest.fn().mockResolvedValue(true),
  createQueryBuilder: () => ({
    where: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(usersMock),
  }),
}
