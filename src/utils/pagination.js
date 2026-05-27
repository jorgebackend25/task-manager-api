export const getPagination = (page, limit) => {
  const pageValue = page ?? 1;
  const limitValue = limit ?? 10;

  const pageNumber = Number(pageValue);
  const limitNumber = Number(limitValue);

  if (Number.isNaN(pageNumber) || Number.isNaN(limitNumber)) {
    return {
      error: "page y limit deben ser números",
    };
  }

  if (pageNumber <= 0 || limitNumber <= 0) {
    return {
      error: "page y limit deben ser números positivos",
    };
  }

  const offset = (pageNumber - 1) * limitNumber;

  return {
    pageNumber,
    limitNumber,
    offset,
  };
};
