import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investimento, TipoInvestimento } from './entities/investimento.entity';
import { CreateInvestimentoDto } from './dto/create-investimento.dto';
import { UpdateInvestimentoDto } from './dto/update-investimento.dto';
import { User } from '../users/entities/user.entity';
import { TransacoesService } from '../transacoes/transacoes.service';
import { UsersService } from '../users/users.service';
import { TipoTransacao } from '../transacoes/entities/transacao.entity';

@Injectable()
export class InvestimentosService {
  constructor(
    @InjectRepository(Investimento)
    private investimentosRepository: Repository<Investimento>,
    private transacoesService: TransacoesService,
    private usersService: UsersService
  ) {}

  async findAll(user: User): Promise<Investimento[]> {
    return this.investimentosRepository.find({
      where: { proprietarioId: user.id },
      order: { dataDaCompra: 'DESC' },
    });
  }

  async findOne(id: string, user: User): Promise<Investimento> {
    const investimento = await this.investimentosRepository.findOne({
      where: { id, proprietarioId: user.id },
    });

    if (!investimento) {
      throw new NotFoundException(`Investimento com ID "${id}" não encontrado`);
    }

    return investimento;
  }

  async create(createInvestimentoDto: CreateInvestimentoDto, user: User): Promise<Investimento> {
    const { valorUnitario, quantidade } = createInvestimentoDto;
    const valorTotal = valorUnitario * quantidade;
    
    // Usar transação para garantir consistência
    const queryRunner = this.investimentosRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Atualizar o saldo do usuário
      await this.usersService.atualizarSaldo(user.id, -valorTotal);
      
      // Criar uma transação de investimento dentro da transação do banco
      await queryRunner.manager.getRepository('transacao').save({
        tipo: TipoTransacao.INVESTIMENTO,
        valor: valorTotal,
        descricao: `Investimento em ${createInvestimentoDto.nome} (${createInvestimentoDto.simbolo})`,
        usuario: user,
        usuarioId: user.id,
        status: 'ATIVA',
        data: new Date()
      });
      
      const investimento = this.investimentosRepository.create({
        ...createInvestimentoDto,
        valorTotal,
        proprietario: user,
        proprietarioId: user.id,
        dataDaCompra: new Date()
      });

      const savedInvestimento = await queryRunner.manager.save(investimento);
      await queryRunner.commitTransaction();
      return savedInvestimento;
      
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err.message || 'Falha ao criar investimento');
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: string,
    updateInvestimentoDto: UpdateInvestimentoDto,
    user: User,
  ): Promise<Investimento> {
    const investimento = await this.findOne(id, user);
    
    const valorUnitario = updateInvestimentoDto.valorUnitario || investimento.valorUnitario;
    const quantidade = updateInvestimentoDto.quantidade || investimento.quantidade;
    const novoValorTotal = valorUnitario * quantidade;
    
    const queryRunner = this.investimentosRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Se houver aumento na posição, criar uma nova transação de investimento
      if (novoValorTotal > investimento.valorTotal) {
        const valorAdicional = novoValorTotal - investimento.valorTotal;
        
        // Atualizar o saldo do usuário
        await this.usersService.atualizarSaldo(user.id, -valorAdicional);
        
        await queryRunner.manager.getRepository('transacao').save({
          tipo: TipoTransacao.INVESTIMENTO,
          valor: valorAdicional,
          descricao: `Aumento de posição em ${investimento.nome} (${investimento.simbolo})`,
          usuario: user,
          usuarioId: user.id,
          status: 'ATIVA',
          data: new Date()
        });
      }
      
      const updatedInvestimento = {
        ...investimento,
        ...updateInvestimentoDto,
        valorTotal: novoValorTotal,
      };
      
      const savedInvestimento = await queryRunner.manager.save(Investimento, updatedInvestimento);
      await queryRunner.commitTransaction();
      return savedInvestimento;
      
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err.message || 'Falha ao atualizar investimento');
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string, user: User): Promise<void> {
    const investimento = await this.findOne(id, user);
    
    const queryRunner = this.investimentosRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Atualizar o saldo do usuário com o valor resgatado
      await this.usersService.atualizarSaldo(user.id, investimento.valorTotal, true);
      
      // Criar uma transação de resgate ao remover o investimento
      await queryRunner.manager.getRepository('transacao').save({
        tipo: TipoTransacao.RESGATE,
        valor: investimento.valorTotal,
        descricao: `Resgate total de ${investimento.nome} (${investimento.simbolo})`,
        usuario: user,
        usuarioId: user.id,
        status: 'ATIVA',
        data: new Date()
      });
      
      const result = await queryRunner.manager.delete(Investimento, { 
        id, 
        proprietarioId: user.id 
      });
      
      if (result.affected === 0) {
        throw new NotFoundException(`Investimento com ID "${id}" não encontrado`);
      }
      
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err.message || 'Falha ao remover investimento');
    } finally {
      await queryRunner.release();
    }
  }
}
