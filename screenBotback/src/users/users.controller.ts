import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ReqestUserDto } from './dto/request-user.dto';

@Controller('/user')
export class UsersController {

    constructor(private ordersService: UsersService){}


    @UseGuards(JwtAuthGuard)
    @Get()
    getUser(@Request() req: any){
        const user: ReqestUserDto = req.user
        return this.ordersService.getUser(user.id)
    }

    // @UseGuards(JwtAuthGuard)
    // @Put()
    // updateUser(@Request() req: any, @Body() obj: object){
    //     return this.ordersService.updateUser(req.user._id, obj)
    // }
    
}
