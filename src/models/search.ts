export const save = (query: String) => {
  const current = JSON.parse(localStorage.getItem("searchQueries") || "[]");
  const newQueries = [query, ...current.slice(0, 9)];
  localStorage.setItem("searchQueries", JSON.stringify(newQueries));
  return newQueries;
};

export const getAll = () => {
  return JSON.parse(localStorage.getItem("searchQueries") || "[]");
};
