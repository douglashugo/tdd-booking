
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

  it("should return null when ID passed is invalid", async () => {
    const user = await userService.findUserById("999");
    expect(user).toBeNull();
  });

  it("should return a user when a valid ID is provided", async () => {
    const user = await userService.findUserById("1");
    expect(user?.getId()).toBe("1");
    expect(user?.getName()).toBe("John Doe");
    expect(user).not.toBeNull();
  });

  it("should save a new user successfully using fake repository and searching again", async () => {
    const newUser = new User("3", "Test Douglas")
    await fakeUserRepository.save(newUser)

    const user = await fakeUserRepository.findById("3")
    
    expect(user?.getId()).toBe("3");
    expect(user?.getName()).toBe("Test Douglas");
    expect(user).not.toBeNull();
  });
});
