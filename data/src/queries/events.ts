import { query } from '../../server';
import { AnyEvent, AppEvent, AppEventType } from '../../types';

export const newEvent = async <T extends AnyEvent['event']>(
  type: T,
  metadata?: Extract<AnyEvent, { event: T }>['metadata'],
) => {
  try {
    const [createdEvent] = await query<AnyEvent>(
      'insert into events (event, metadata) values($1, $2::jsonb) returning *',
      [type, metadata ?? {}],
    );
    return createdEvent;
  } catch (err) {
    // Swallow errors when writing events. No exceptions should occur based on
    // this operation since it's a side-effect of other operations.
    console.error(err);
    return undefined;
  }
};
