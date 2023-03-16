import { EnumRoles } from '@lib/enums'
import { SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: EnumRoles[]) => SetMetadata(ROLES_KEY, roles)
