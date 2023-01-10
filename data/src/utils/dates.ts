/**
 *  This fixes the date string so that it can be passed to a datetime-local field
 *  (removes the :00.000Z).
 */
export const truncateDate = (date: string) => date.replace(/(.*):.*Z/, '$1');
