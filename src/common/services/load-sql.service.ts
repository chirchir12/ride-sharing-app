import { readdirSync, readFileSync } from 'fs';
import { join, extname, basename } from 'path';
import { DataSource } from 'typeorm';

export class LoadSQL<Q> {
  private sqlPath: string;
  public queries: Q;
  public dataSource: DataSource;
  constructor(sqlPath: string, dataSource: DataSource) {
    this.sqlPath = sqlPath;
    this.dataSource = dataSource;
  }
  readSQLFiles() {
    const path = join(this.sqlPath);
    const files = readdirSync(path);
    files.forEach((file) => {
      if (extname(file) === '.sql') {
        const fileName = basename(file, '.sql');
        this.queries[fileName] = readFileSync(join(path, file), {
          encoding: 'utf8',
          flag: 'r',
        });
      } else {
        throw new Error('must be inside SQL File');
      }
    });
    return;
  }

  public async runSQL(sql: string, args: string[] | number[] = []) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      return queryRunner.manager.query(sql, args);
    } catch (error) {
      throw error;
    } finally {
      queryRunner.release();
    }
  }
}
