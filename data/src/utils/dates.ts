const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 *  This fixes the date string so that it can be passed to a datetime-local field
 *  (removes the :00.000Z).
 */
export const truncateDate = (date: string) => date.replace(/(.*):.*Z/, '$1');

/**
 * Make a date string like: 6 Jun or 25 Dec
 */
export const dateStr = (d: Date, year?: boolean) =>
  `${d.getDate()} ${months[d.getMonth()]}${year ? ` ${d.getFullYear()}` : ''}`;
