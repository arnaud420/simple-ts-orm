import express, { Request, Response } from 'express';
import { Album, User } from './models';

const port = 8080;
const app = express();

async function run(): Promise<Album> {
  // const album = await Album.findById(12, {
  //   includes: ['user', 'photos'],
  // });
  // const albums = await Album.find({
  //   limit: 1,
  //   // start: 10,
  //   where: {
  //     userId: 1,
  //   },
  // });
  // const album = await Album.create({
  //   userId: 10,
  //   id: 101,
  //   title: 'enim repellat iste',
  // });

  const data = await Album.findById(1);

  // const album = new Album(data);

  // const updated = Album.update(album);

  // console.log(albums);
  // return albums;
  console.log('album', data);

  data.title = 'test title';

  // data.user = new User({
  //   id: 1, name: 'test', username: 'test', address: 'test', email: 'test',
  // });

  console.log('album', data);

  return data;
}

app.listen(port);

run().catch((err) => {
  console.error('err', err);
});
