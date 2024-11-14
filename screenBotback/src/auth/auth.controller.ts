import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ReqestAuthDto } from './dto/request-auth.dto'

@Controller('/auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('/login')
    login(@Body() data: ReqestAuthDto){
        // console.log('login', data)
        return this.authService.login(data)
    }

}
