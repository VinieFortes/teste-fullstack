import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Investimento } from './entities/investimento.entity';
import { InvestimentosService } from './investimentos.service';
import { InvestimentosController } from './investimentos.controller';
import { TransacoesModule } from '../transacoes/transacoes.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Investimento]),
    TransacoesModule,
    UsersModule
  ],
  controllers: [InvestimentosController],
  providers: [InvestimentosService],
  exports: [InvestimentosService],
})
export class InvestimentosModule {}
