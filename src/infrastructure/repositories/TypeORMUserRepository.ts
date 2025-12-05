import { Repository } from "typeorm";
import { UserEntity } from "../persistence/entities/UserEntity";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { User } from "../../domain/entities/User";
import { UserMapper } from "../persistence/mappers/UserMapper";

export class TypeORMUserRepository implements UserRepository {
    private readonly repository: Repository<UserEntity>;
    constructor(repository: Repository<UserEntity>){
        this.repository = repository;
    }
    async save(user: User): Promise<void> {
        const entity = new UserEntity();
        entity.id = user.getId();
        entity.name = user.getName();
        await this.repository.save(entity);
    }
    async findById(id: string): Promise<User | null> {
        const userEntity = await this.repository.findOne({ where: { id } });
        return userEntity ? UserMapper.toDomain(userEntity) : null;
    }
}