
import { FakeUserRepository } from "../../infrastructure/repositories/FakeUserRepository";
import { User } from "../../domain/entities/User";
import { UserService } from "./UserService";

describe("UserService", () => {
  let userService: UserService;
  let fakeUserRepository: FakeUserRepository;

  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    userService = new UserService(fakeUserRepository);
  });

  it("deve retornar null quando ID passado for inválido", async () => {
    const user = await userService.findUserById("999");
    expect(user).toBeNull();
  });

  it("deve retornar um usuário quando o ID fornecido for válido", async () => {
    const user = await userService.findUserById("1");
    expect(user?.getId()).toBe("1");
    expect(user?.getName()).toBe("John Doe");
    expect(user).not.toBeNull();
  });

  it("deve salvar um novo usuário com sucesso usando repositório fake e buscando novamente", async () => {
    const newUser = new User("3", "Test Douglas")
    await fakeUserRepository.save(newUser)

    const user = await fakeUserRepository.findById("3")
    
    expect(user?.getId()).toBe("3");
    expect(user?.getName()).toBe("Test Douglas");
    expect(user).not.toBeNull();
  });
});
