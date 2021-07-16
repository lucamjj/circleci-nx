const formatZuluTime = (stringDate: string) => {
  const date = new Date(stringDate);
  return `${date.toUTCString()}`;
};

export default formatZuluTime;
