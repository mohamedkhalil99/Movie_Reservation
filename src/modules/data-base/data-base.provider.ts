import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mariadb',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'movie_reservation',
        entities: [__dirname + '/../**/*.entity{.ts,.js}',],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];