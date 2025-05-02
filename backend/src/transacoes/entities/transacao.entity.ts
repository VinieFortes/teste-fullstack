import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TipoTransacao {
  DEPOSITO = 'DEPOSITO',
  SAQUE = 'SAQUE',
  INVESTIMENTO = 'INVESTIMENTO',
  RESGATE = 'RESGATE',
}

export enum StatusTransacao {
  ATIVA = 'ATIVA',
  REVERTIDA = 'REVERTIDA',
}

@Entity()
export class Transacao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  valor: number;

  @Column('text')
  tipo: TipoTransacao;

  @Column({
    type: 'text',
    default: StatusTransacao.ATIVA,
  })
  status: StatusTransacao;

  @Column({ nullable: true })
  revertidaEm?: Date;

  @Column({ nullable: true })
  motivoReversao?: string;

  @Column()
  descricao: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  data: Date;

  @ManyToOne(() => User, user => user.transacoes, { onDelete: 'CASCADE' })
  usuario: User;

  @Column()
  usuarioId: string;
}
