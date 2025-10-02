import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";

export class FakeUserRepository implements UserRepository {
  private users: User[] = [
    new User("1", "John Doe"),
    new User("2", "Jane Smith"),
  ];

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.getId() === id) || null;
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
  }
}
