export const createTimeOptions = (from = 8, to = 22) => {
  // create options every 15 minutes
  const options = [];

  for (let i = from; i < to; i++) {
    for (let j = 0; j < 60; j += 15) {
      const hours = `${i}`.padStart(2, "0");
      const minutes = `${j}`.padStart(2, "0");
      options.push(`${hours}:${minutes}`);
    }
  }
  // Don't add the final hour if it's the closing time
  return options;
};

export const getDateInOneYear = () => {
  const today = new Date();

  return new Date(today.setFullYear(today.getFullYear() + 1));
};
