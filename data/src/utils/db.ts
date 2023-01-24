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
  return pool;
};

export const query = async <T extends QueryResultRow>(
  q: string,
  vars?: any[],
): Promise<T[]> => {
  if (pool === undefined) {
    connect();
  }
  const res = await pool.query<T>(q, vars);
  return res.rows || [];
};

export const close = () => {
  if (!pool) {
    return;
  }
  pool.end();
};

// const stripNulls = <O>(arr: O[]): Partial<O>[] => {
//   return arr.map(obj =>
//     Object.entries(obj ?? {}).reduce(
//       (o, [k, v]) => (v === null ? o : { ...o, [k]: v }),
//       {},
//     ),
//   );
// };
