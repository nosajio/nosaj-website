import { Pool, QueryResultRow } from 'pg';
import { ZodObject } from 'zod';

export let pool: Pool;

/**
 * No authentication details are used here. All auth details should be added as
 * environment variables (see:
 * https://node-postgres.com/features/connecting#environment-variables)
 */
export const connect = () => {
  if (pool) {
    return pool;
  }
  pool = new Pool();
  console.log('connected to db');
};

export const query = async <T extends QueryResultRow>(
  q: string,
  vars?: any[],
) => {
  if (!pool) {
    connect();
  }
  const res = await pool.query<T>(q, vars);
  return res.rows ? stripNulls<T>(res.rows) : res.rows;
};

export const close = () => {
  if (!pool) {
    return;
  }
  pool.end();
};

const stripNulls = <O>(arr: O[]): Partial<O>[] => {
  return arr.map(obj =>
    Object.entries(obj ?? {}).reduce(
      (o, [k, v]) => (v === null ? o : { ...o, [k]: v }),
      {},
    ),
  );
};
