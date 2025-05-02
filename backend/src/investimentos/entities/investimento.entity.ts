import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TipoInvestimento {
  ACAO = 'ACAO',
  FUNDO = 'FUNDO',
  RENDA_FIXA = 'RENDA_FIXA',
  CRIPTO = 'CRIPTO',
}

@Entity()
export class Investimento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  simbolo: string;

  @Column({
    type: 'varchar',
    default: TipoInvestimento.ACAO
  })
  tipo: TipoInvestimento;

  @Column('decimal', { precision: 10, scale: 2 })
  valorUnitario: number;

  @Column('decimal', { precision: 10, scale: 2 })
  quantidade: number;

  @Column('decimal', { precision: 10, scale: 2 })
  valorTotal: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  dataDaCompra: Date;

  @ManyToOne(() => User, user => user.investimentos, { onDelete: 'CASCADE' })
  proprietario: User;

  @Column()
  proprietarioId: string;
}
