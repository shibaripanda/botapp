import { Module, forwardRef } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
// import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from 'src/users/users.module'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    // MongooseModule.forFeature([]),
    JwtModule.register({secret: process.env.SECRET_KEY, signOptions: {expiresIn: '24h'}}),
    forwardRef(() => UsersModule)
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
