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

  const album = await Album.findById(1, {
    includes: ['user'],
  });

  if (album.user) {
    album.user.username = 'Toto';
    const test = await album.user.save();
    console.log('test', test);
  }

  // const album = new Album(album);


  // console.log(albums);
  // return albums;

  // const updated = Album.updateById(album);

  // album.user = new User({
  //   id: 1, name: 'test', username: 'test', address: 'test', email: 'test',
  // });

  return album;
}

app.listen(port);

run().catch((err) => {
  console.error('err', err);
});
