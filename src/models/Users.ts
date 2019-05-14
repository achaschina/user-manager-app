import { Address } from './Address';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  password: string;
  address?: Address[];
}
