import { query } from '../../server';
import { AnyEvent, AppEvent, AppEventType } from '../../types';

export const newEvent = async <T extends AnyEvent['event']>(
  type: T,
  metadata?: Extract<AnyEvent, { event: T }>['metadata'],
) => {
  const [createdEvent] = await query<AnyEvent>(
    'insert into events (event, metadata) values($1, $2::jsonb) returning *',
    [type, metadata ?? {}],
  );
  return createdEvent;
};
