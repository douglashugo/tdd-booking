import { User } from "../domain/entities/User";
import { UserRepository } from "../domain/repositories/UserRepository";
import { FakeUserRepository } from "../infrastructure/repositories/FakeUserRepository";

export class UserService {

    constructor(private readonly userRepository: UserRepository) {}

    async findUserById(id: string): Promise<User | null> {
        return this.userRepository.findById(id)
    }
}