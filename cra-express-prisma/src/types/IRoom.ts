import IUser from "./IUser";

export interface IRoom {
  id: string;
  name: string;
  users: IUser["id"][];
}
