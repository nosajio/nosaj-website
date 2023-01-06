export const getSlug = (title: string) =>
  title.replace(/\W+/g, '-').toLowerCase();
