import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JWT_SECRET } from '../utils/env'

const cookiesExtractor = (req: Request) => {
  return req.cookies?.Authentication
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookiesExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    })
  }

  async validate(payload: any) {
    return payload
  }
}
