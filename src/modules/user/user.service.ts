import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginResponseDto, LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  // User CRUD
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user: User = new User();
    const { email, name, password } = createUserDto;

    user.email = email;
    user.name = name;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    return this.userRepository.save(user);
  }

  getAll() {
    return this.userRepository.find();
  }

  getOne(uuid: string) {
    return this.userRepository.findOneBy({ uuid });
  }

  async update(uuid: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ uuid });

    if (!user) return null;

    const updatedUserData = this.userRepository.merge(user, updateUserDto);

    return this.userRepository.save(updatedUserData);
  }

  remove(uuid: string) {
    return this.userRepository.delete(uuid);
  }

  async login(loginDto: LoginUserDto): Promise<LoginResponseDto | null> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });
    const isEligible = await user?.validatePassword(password);

    if (user && isEligible) {
      const response = new LoginResponseDto();

      response.email = user.email;
      response.name = user.name;
      response.uuid = user.uuid;

      return response;
    }

    return null;
  }
}
