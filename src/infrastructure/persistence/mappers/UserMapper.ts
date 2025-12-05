import { User } from "../../../domain/entities/User";
import { UserEntity } from "../entities/UserEntity";

export class UserMapper {
    static toDomain(entity: UserEntity): User {
        return new User(entity.id, entity.name);
    }

    static toPersistence(user: User): UserEntity {
        const entity = new UserEntity();
        entity.id = user.getId();
        entity.name = user.getName();
        return entity;
    }
}