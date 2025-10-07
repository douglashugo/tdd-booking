import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";


export class UserService {

    constructor(private readonly userRepository: UserRepository) {}

    async findUserById(id: string): Promise<User | null> {
        return this.userRepository.findById(id)
    }
}