import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  nome: string;

  @Column()
  @Exclude()
  password: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  saldo: number;

  @OneToMany('Investimento', 'proprietario')
  investimentos: any[];

  @OneToMany('Transacao', 'usuario')
  transacoes: any[];
}
