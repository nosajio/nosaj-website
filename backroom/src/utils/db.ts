import { Pool, QueryResultRow } from 'pg';

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
  return res.rows;
};

export const close = () => {
  if (!pool) {
    return;
  }
  pool.end();
};
