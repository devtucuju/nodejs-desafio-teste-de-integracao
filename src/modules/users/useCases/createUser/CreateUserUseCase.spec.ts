import { AppError } from "../../../../shared/errors/AppError";

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });
  it("should be able to create a new user", async () => {
    const createdNewUser: ICreateUserDTO = {
      name: "XuxadaSilva",
      email: "xuxa@silva.com",
      password: "123456",
    };
    const newUserCreated = await createUserUseCase.execute(createdNewUser);
    expect(newUserCreated).toHaveProperty("id");
  });

  it("should not be able to create a new user with same email", async () => {
    const createdNewUser: ICreateUserDTO = {
      name: "XuxadaSilva1",
      email: "xuxa1@silva.com",
      password: "123456",
    };

    const createDuplicatedUser: ICreateUserDTO = {
      name: "XuxadaSilva2",
      email: "xuxa1@silva.com",
      password: "123456",
    };
    await createUserUseCase.execute(createdNewUser);

    await expect(
      createUserUseCase.execute(createDuplicatedUser)
    ).rejects.toEqual(new CreateUserError());
  });
});
