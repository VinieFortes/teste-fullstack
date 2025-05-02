import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { TipoInvestimento } from '../entities/investimento.entity';

export class UpdateInvestimentoDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  simbolo?: string;

  @IsEnum(TipoInvestimento)
  @IsOptional()
  tipo?: TipoInvestimento;

  @IsNumber()
  @Min(0)
  @IsOptional()
  valorUnitario?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  quantidade?: number;
}
