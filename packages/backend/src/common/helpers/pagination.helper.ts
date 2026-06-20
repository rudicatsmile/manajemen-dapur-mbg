export function paginate(page: number, perPage: number) {
  const take = Math.min(perPage, 100);
  const skip = (Math.max(page, 1) - 1) * take;
  return { skip, take };
}

export function paginationMeta(total: number, page: number, perPage: number) {
  return { page, perPage, total, totalPages: Math.ceil(total / perPage) };
}
