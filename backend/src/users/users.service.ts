import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ 
      select: ['id', 'email', 'nome', 'saldo']  
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'email', 'nome', 'saldo'],
    });
    if (!user) {
      throw new NotFoundException(`Usuário com ID "${id}" não encontrado`);
    }
    return user as User;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    return user as User;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;
    
    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = this.usersRepository.create({
      ...rest,
      password: hashedPassword,
    });
    
    await this.usersRepository.save(user);
    
    const { password: _, ...result } = user;
    return result as User;
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    
    return user;
  }

  async atualizarSaldo(userId: string, valor: number, isDeposito: boolean = false): Promise<User> {
    const user = await this.findOne(userId);
    
    const novoSaldo = +user.saldo + valor;
    
    // Permite saldo negativo apenas para depósitos
    if (novoSaldo < 0 && !isDeposito) {
      throw new UnauthorizedException('Saldo insuficiente para esta operação');
    }
    
    await this.usersRepository.update(userId, { saldo: novoSaldo });
    
    return this.findOne(userId);
  }
}
