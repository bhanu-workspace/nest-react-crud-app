import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userData = await this.userRepository.create(createUserDto);
    return this.userRepository.save(userData);
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('User Not Found', 404);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const existingUser = await this.findOne(id);
    if (!existingUser) {
      throw new HttpException('User Not Found', 404);
    }
    const userData = this.userRepository.merge(existingUser, updateUserDto);
    return await this.userRepository.save(userData);
  }

  async remove(id: number): Promise<UserEntity> {
    const existingUser = await this.findOne(id);
    if (!existingUser) {
      throw new HttpException('User Not Found', 404);
    }
    return await this.userRepository.remove(existingUser);
  }
}
