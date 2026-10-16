import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';

/**
 * 认证应用服务：注册、登录与当前用户查询。
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /** 注册账号，注册成功后直接发放 token（视为已登录）。 */
  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existing = await this.userRepository.findOne({ where: { username: dto.username } });
    if (existing) {
      throw new ConflictException('用户名已存在');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      username: dto.username,
      passwordHash,
      nickname: dto.nickname?.trim() || dto.username,
      role: dto.role,
    });
    const saved = await this.userRepository.save(user);
    this.logger.log(`新用户注册：${saved.username}（${saved.role}）`);
    return this.buildAuthResponse(saved);
  }

  /** 登录：校验用户名与密码，返回用户信息 + JWT。 */
  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOne({ where: { username: dto.username } });
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    const matched = await bcrypt.compare(dto.password, user.passwordHash);
    if (!matched) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    return this.buildAuthResponse(user);
  }

  /** 根据 token 中的用户 id 查询当前用户。 */
  async me(userId: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('用户不存在或登录已失效');
    }
    return UserResponseDto.from(user);
  }

  private buildAuthResponse(user: User): AuthResponseDto {
    const token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
      role: user.role,
    });
    return { user: UserResponseDto.from(user), token };
  }
}
