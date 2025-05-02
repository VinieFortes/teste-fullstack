import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { InvestimentosService } from './investimentos.service';
import { CreateInvestimentoDto } from './dto/create-investimento.dto';
import { UpdateInvestimentoDto } from './dto/update-investimento.dto';
import { Investimento } from './entities/investimento.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('investimentos')
@UseGuards(JwtAuthGuard)
export class InvestimentosController {
  constructor(private readonly investimentosService: InvestimentosService) {}

  @Get()
  findAll(@Request() req): Promise<Investimento[]> {
    return this.investimentosService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req): Promise<Investimento> {
    return this.investimentosService.findOne(id, req.user);
  }

  @Post()
  create(@Body() createInvestimentoDto: CreateInvestimentoDto, @Request() req): Promise<Investimento> {
    return this.investimentosService.create(createInvestimentoDto, req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInvestimentoDto: UpdateInvestimentoDto,
    @Request() req,
  ): Promise<Investimento> {
    return this.investimentosService.update(id, updateInvestimentoDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.investimentosService.remove(id, req.user);
  }
}
