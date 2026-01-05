import { User } from "../../domain/entities/User";
import { DataSource, Repository } from "typeorm";
import { UserEntity } from "../persistence/entities/UserEntity";
import { TypeORMUserRepository } from "./TypeORMUserRepository";

describe("TyperORMRepository", () => {
  let dataSource: DataSource;
  let userRepository: TypeORMUserRepository;
  let repository: Repository<UserEntity>;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      entities: [UserEntity],
      synchronize: true,
      logging: false,
    });
    await dataSource.initialize();
    repository = dataSource.getRepository(UserEntity);
    userRepository = new TypeORMUserRepository(repository);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it("should save a user in the database", async () => {
    const user = new User("1", "Jhon Doe");
    await userRepository.save(user);

    const savedUser = await repository.findOne({ where: { id: "1" } });
    expect(savedUser).not.toBeNull();
    expect(savedUser?.id).toBe("1");
    expect(savedUser?.name).toBe("Jhon Doe");
  });

  it("should return a user when a valid ID is provided", async () => {
    const user = new User("1", "Jhon Doe");
    await userRepository.save(user);

    const savedUser = await userRepository.findById("1");
    expect(savedUser).not.toBeNull();
    expect(savedUser?.getId()).toBe("1");
    expect(savedUser?.getName()).toBe("Jhon Doe");
  });

  it("should return null when searching for a non-existing user", async () => {
    const user = await userRepository.findById("999");
    expect(user).toBeNull();
  });
});
