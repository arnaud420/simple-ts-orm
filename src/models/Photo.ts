import Model from '../Model';
import { API_URL } from '../config';

class Photo extends Model {
  albumId: number;

  title: string;

  url: string;

  thumbnailUrl: string;

  constructor(data: Photo) {
    super(data.id);
    this.albumId = data.albumId;
    this.title = data.title;
    this.url = data.url;
    this.thumbnailUrl = data.thumbnailUrl;
  }

  static config = {
    endpoint: `${API_URL}/photos`,
  };
}

export default Photo;
