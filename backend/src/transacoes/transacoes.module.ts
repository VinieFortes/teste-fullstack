import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transacao } from './entities/transacao.entity';
import { TransacoesService } from './transacoes.service';
import { TransacoesController } from './transacoes.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transacao]),
    UsersModule
  ],
  controllers: [TransacoesController],
  providers: [TransacoesService],
  exports: [TransacoesService],
})
export class TransacoesModule {}
