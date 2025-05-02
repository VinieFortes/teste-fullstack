import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { TipoInvestimento } from '../entities/investimento.entity';

export class CreateInvestimentoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  simbolo: string;

  @IsEnum(TipoInvestimento)
  tipo: TipoInvestimento;

  @IsNumber()
  @Min(0)
  valorUnitario: number;

  @IsNumber()
  @Min(0)
  quantidade: number;
}
