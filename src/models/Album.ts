import Model from '../Model';
import { API_URL } from '../config';
import { RelationType } from '../enums';
import Photo from './Photo';
import User from './User';

class Album extends Model {
  title: string;

  userId: number;

  readonly user?: User;

  readonly photos?: Photo[];

  constructor(data: Album) {
    super(data.id);
    this.title = data.title;
    this.userId = data.userId;
    this.user = data.user;
    this.photos = data.photos;
  }

  static config = {
    endpoint: `${API_URL}/albums`,
    relations: {
      user: {
        type: RelationType.BelongsTo,
        model: User,
        foreignKey: 'userId',
      },
      photos: {
        type: RelationType.HasMany,
        model: Photo,
        foreignKey: 'albumId',
      },
    },
  };
}

export default Album;
