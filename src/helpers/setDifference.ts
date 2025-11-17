/** strings in A that are not in B */
export function setDifference(A: string[], B: string[]) {
  return A.filter(function (x) {
    return B.indexOf(x) < 0;
  });
}
