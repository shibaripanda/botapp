import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs'

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest()
        try{
            const authHeader = req.handshake.auth.token.Authorization
            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]

            if(bearer !== 'Bearer' || !token){
                console.log('Авторизация false')
                // throw new UnauthorizedException({message: 'Нет авторизации'})
            }
            const user = this.jwtService.verify(token)
            console.log(user.id)
            req.user = user
            console.log('Авторизация true')
            return true
        }
        catch(e){
            console.log('Авторизация false')
            // throw new UnauthorizedException({message: 'Нет авторизации'})
        }
    }

}