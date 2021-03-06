import { AppError } from "../../../../shared/errors/AppError";

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });
  it("should not be able to authenticate a non-existing user", async () => {
    const createdUser: ICreateUserDTO = {
      name: "XuxadaSilva",
      email: "xuxa@silva.com",
      password: "123456",
    };
    await createUserUseCase.execute(createdUser);
    await expect(
      authenticateUserUseCase.execute({
        email: "nonexistinguseremail@test.com",
        password: createdUser.password,
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });
  it("should not be able to authenticate a user with incorrect email", async () => {
    const createdUser: ICreateUserDTO = {
      name: "XuxadaSilva",
      email: "xuxa@silva.com",
      password: "123456",
    };
    await createUserUseCase.execute(createdUser);
    await expect(
      authenticateUserUseCase.execute({
        email: "incorrectuseremail@test.com",
        password: createdUser.password,
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });
  it("should not be able to authenticate a user with incorrect password", async () => {
    const createdUser: ICreateUserDTO = {
      name: "XuxadaSilva",
      email: "xuxa@silva.com",
      password: "123456",
    };
    await createUserUseCase.execute(createdUser);
    await expect(
      authenticateUserUseCase.execute({
        email: createdUser.email,
        password: "123456789",
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });
  it("should be able to authenticate an user", async () => {
    const createdUser: ICreateUserDTO = {
      name: "XuxadaSilva",
      email: "xuxa@silva.com",
      password: "123456",
    };

    const { email } = await createUserUseCase.execute(createdUser);

    const authenticatedUser = await authenticateUserUseCase.execute({
      email,
      password: createdUser.password,
    });
    expect(authenticatedUser).toHaveProperty("token");
  });
});
