import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { TipoTransacao } from '../entities/transacao.entity';

export class CreateTransacaoDto {
  @IsNumber()
  @Min(0)
  valor: number;

  @IsEnum(TipoTransacao)
  tipo: TipoTransacao;

  @IsString()
  @IsNotEmpty()
  descricao: string;
}
