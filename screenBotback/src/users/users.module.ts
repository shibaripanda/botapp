import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersSchema } from './user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { UserGateway } from './user.gateway';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UsersSchema }]), forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService, UserGateway],
  exports: [UsersService]
})
export class UsersModule {}
