import Model from '../Model';
import { API_URL } from '../config';

class User extends Model {
  name: string;

  username: string;

  email: string;

  address: string;

  constructor(data: User) {
    super(data.id);
    this.name = data.name;
    this.username = data.username;
    this.email = data.email;
    this.address = data.address;
  }

  static config = {
    endpoint: `${API_URL}/users`,
  };
}

export default User;
