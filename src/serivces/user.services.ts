import { Axios } from "axios";
import customAxios from "../utils/Axios";
import User from "../model/user";

export default class UserService {
  service: Axios = customAxios;

  public async getUsers(): Promise<User[]> {
    return this.service.get("/user").then((result) => result.data);
  }

  public async createUser(name: string): Promise<User> {
    return this.service.post("/user", { name }).then((result) => result.data);
  }
}
