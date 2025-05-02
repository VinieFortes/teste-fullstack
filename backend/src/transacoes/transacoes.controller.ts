import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { TransacoesService } from './transacoes.service';
import { CreateTransacaoDto } from './dto/create-transacao.dto';
import { Transacao } from './entities/transacao.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('transacoes')
@UseGuards(JwtAuthGuard)
export class TransacoesController {
  constructor(private readonly transacoesService: TransacoesService) {}

  @Get()
  findAll(@Request() req): Promise<Transacao[]> {
    return this.transacoesService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req): Promise<Transacao> {
    return this.transacoesService.findOne(id, req.user);
  }

  @Post()
  create(@Body() createTransacaoDto: CreateTransacaoDto, @Request() req): Promise<Transacao> {
    return this.transacoesService.create(createTransacaoDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.transacoesService.remove(id, req.user);
  }

  @Post(':id/reverter')
  reverterTransacao(
    @Param('id') id: string,
    @Body('motivo') motivo: string,
    @Request() req
  ): Promise<void> {
    return this.transacoesService.reverterTransacao(id, req.user, motivo);
  }
}
