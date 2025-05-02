import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transacao, TipoTransacao, StatusTransacao } from './entities/transacao.entity';
import { CreateTransacaoDto } from './dto/create-transacao.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class TransacoesService {
  constructor(
    @InjectRepository(Transacao)
    private transacoesRepository: Repository<Transacao>,
    private usersService: UsersService
  ) {}

  async findAll(user: User): Promise<Transacao[]> {
    return this.transacoesRepository.find({
      where: { usuarioId: user.id },
      order: { data: 'DESC' },
    });
  }

  async findOne(id: string, user: User): Promise<Transacao> {
    const transacao = await this.transacoesRepository.findOne({
      where: { id, usuarioId: user.id },
    });

    if (!transacao) {
      throw new NotFoundException(`Transação com ID "${id}" não encontrada`);
    }

    return transacao;
  }

  async create(createTransacaoDto: CreateTransacaoDto, user: User): Promise<Transacao> {
    const { tipo, valor } = createTransacaoDto;
    const isDeposito = tipo === TipoTransacao.DEPOSITO || tipo === TipoTransacao.RESGATE;

    // Atualizar o saldo do usuário
    if (tipo === TipoTransacao.SAQUE || tipo === TipoTransacao.INVESTIMENTO) {
      if (user.saldo < valor) {
        throw new BadRequestException('Saldo insuficiente para esta operação');
      }
      await this.usersService.atualizarSaldo(user.id, -valor, false);
    } else {
      await this.usersService.atualizarSaldo(user.id, valor, isDeposito);
    }
    
    const transacao = this.transacoesRepository.create({
      ...createTransacaoDto,
      usuario: user,
      usuarioId: user.id,
      status: StatusTransacao.ATIVA
    });

    return this.transacoesRepository.save(transacao);
  }

  async remove(id: string, user: User): Promise<void> {
    await this.reverterTransacao(id, user, "Transação removida pelo usuário");
  }

  async reverterTransacao(id: string, user: User, motivo: string): Promise<void> {
    const transacao = await this.findOne(id, user);
    
    if (transacao.status === StatusTransacao.REVERTIDA) {
      throw new BadRequestException('Esta transação já foi revertida');
    }
    
    // Reverter o efeito da transação no saldo
    const { tipo, valor } = transacao;
    const isDeposito = tipo === TipoTransacao.SAQUE || tipo === TipoTransacao.INVESTIMENTO;
    
    if (tipo === TipoTransacao.SAQUE || tipo === TipoTransacao.INVESTIMENTO) {
      await this.usersService.atualizarSaldo(user.id, valor, isDeposito); // Devolve o valor ao saldo
    } else if (tipo === TipoTransacao.DEPOSITO || tipo === TipoTransacao.RESGATE) {
      await this.usersService.atualizarSaldo(user.id, -valor, isDeposito); // Retira o valor do saldo
    }
    
    // Atualizar status da transação
    await this.transacoesRepository.update(
      { id, usuarioId: user.id },
      { 
        status: StatusTransacao.REVERTIDA,
        revertidaEm: new Date(),
        motivoReversao: motivo
      }
    );
  }
}
