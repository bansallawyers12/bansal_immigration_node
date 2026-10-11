import "server-only";
import mysql from "mysql2/promise";

let pool: mysql.Pool | undefined;

export function getPool(): mysql.Pool {
  if (!pool) {
    const database = process.env.DB_DATABASE;
    const user = process.env.DB_USERNAME;
    if (!database || !user) {
      throw new Error("Database settings are missing. Set DB_* in .env.local.");
    }

    pool = mysql.createPool({
      host: process.env.DB_HOST ?? "127.0.0.1",
      port: Number(process.env.DB_PORT ?? 3306),
      database,
      user,
      password: process.env.DB_PASSWORD ?? "",
      waitForConnections: true,
      connectionLimit: 10,
      timezone: "Z",
      dateStrings: true,
    });
  }

  return pool;
}

export async function query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  const [rows] = await getPool().query(sql, params);
  return rows as T[];
}

export async function withTransaction<T>(fn: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> {
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    const result = await fn(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
