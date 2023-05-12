import http from 'k6/http'
import { sleep, check } from 'k6'
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js'

import faker from 'https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js'

export function handleSummary(data) {
  return {
    'summary.html': htmlReport(data),
  }
}

export const options = {
  stages: [
    { duration: '30s', target: 2 },
    { duration: '5m', target: 2 },
    { duration: '30s', target: 4 },
    { duration: '5m', target: 4 },
    { duration: '30s', target: 6 },
    { duration: '5m', target: 6 },
    { duration: '30s', target: 8 },
    { duration: '5m', target: 8 },
    { duration: '1m', target: 0 },
  ],
}

function generateCPF() {
  let cpf = ''
  for (let i = 0; i < 9; i++) {
    cpf += Math.floor(Math.random() * 10)
  }

  let sum = 0
  let remainder

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i)
  }

  remainder = (sum * 10) % 11

  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }

  cpf += remainder

  sum = 0

  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i)
  }

  remainder = (sum * 10) % 11

  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }

  cpf += remainder

  return cpf
}

const ENDPOINT = 'https://socio-torcedor-api-haleq5au3a-uc.a.run.app/'

const fetcher = ({ method, path, body, accessToken }) => {
  return http.request(method, `${ENDPOINT}${path}`, body ? JSON.stringify(body) : null, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken ? `Bearer ${accessToken}` : null,
    },
  })
}

const getTeamAccessToken = () => {
  const res = fetcher({
    method: 'POST',
    path: '/auth/team',
    body: {
      clientId: '53ca2d54-1d8e-4abf-abe4-1d93ca623e19',
      secret: 'TwrHeK69g6yY94aq1RUE4WDssaUC@JcEJaQbF4eB',
    },
    accessToken: null,
  })

  check(res, {
    'is status 201': (r) => r.status === 201,
  })

  const data = res.json()

  check(data, {
    'has access token': (r) => !!r.accessToken,
  })

  return data.accessToken
}

const getUserAccessToken = (email, password) => {
  const res = fetcher({
    method: 'POST',
    path: '/auth',
    body: {
      email: email,
      password: password,
    },
    accessToken: null,
  })

  check(res, {
    'is status 201': (r) => r.status === 201,
  })

  const data = res.json()

  check(data, {
    'has access token': (r) => !!r.accessToken,
  })

  return data.accessToken
}

const createUser = (accessToken) => {
  const res = fetcher({
    method: 'POST',
    path: '/users',
    body: {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email().toLowerCase(),
      password: 'P@assword123',
      confirmPassword: 'P@assword123',
      taxId: generateCPF(),
      birthday: '2000-02-11',
      gender: 'MALE',
    },
    accessToken: accessToken,
  })

  check(res, {
    'is status 201': (r) => r.status === 201,
  })

  const data = res.json()

  return { email: data.email }
}

const createMembership = (accessToken) => {
  const res = fetcher({
    method: 'POST',
    path: '/membership',
    body: {
      planId: '5b9d5fff-4a34-4382-9f40-b1d506798764',
    },
    accessToken: accessToken,
  })

  check(res, {
    'is status 201': (r) => r.status === 201,
  })
}

const checkin = (accessToken) => {
  const res = fetcher({
    method: 'POST',
    path: '/checkin',
    body: {
      sectorId: '5d7b1cfa-f1d9-46ee-b6bf-203ff115141e',
      matchId: '4d54613a-1088-4b88-86cc-4730354b3403',
    },
    accessToken: accessToken,
  })

  // check(res, {
  //   'is status 201': (r) => r.status === 201,
  // })

  const data = res.json()

  return data
}

export default function () {
  const teamToken = getTeamAccessToken()
  const { email } = createUser(teamToken)
  const userToken = getUserAccessToken(email, 'P@assword123')
  createMembership(userToken)
  checkin(userToken)

  sleep(1)
}
