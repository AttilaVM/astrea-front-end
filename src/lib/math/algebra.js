export function bound(v, lowerBound, upperBound) {
  if (v < lowerBound)
    return lowerBound;
  else if (v > upperBound)
    return upperBound;
  else
    return v;
}
