import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JWTService {
  constructor(private jwtService: JwtService) {}

  async sign(payload: any): Promise<string> {
    return this.jwtService.sign(payload)
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verify(token)
  }
}
