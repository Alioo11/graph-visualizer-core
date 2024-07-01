const generateSnappedRange = (start: number, end: number, step: number) => {
  const startingPoint = (Math.floor(start / step) + 1) * step;
  const pointsCount = Math.floor((end - start) / step) + 1;
  return Array.from(new Array(pointsCount).keys()).map((i) => startingPoint + step * i);
};

export default generateSnappedRange;
