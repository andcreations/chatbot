export class Match {
  public static matchStrings(a: string, b: string | undefined): boolean {
    if (!b) {
      return true;
    }
    const aLower = a.toLowerCase().trim();  
    const bLower = b.toLowerCase().trim();
    return aLower === bLower || aLower.includes(bLower) || bLower.includes(aLower);
  }

  public static matchArrayWithStringArray(
    aArray: string[],
    b: string | undefined,
  ): boolean {
    if (!b) {
      return true;
    }
    const bArray = b.split(',').map(item => item.trim());
    return aArray.some(item => bArray.includes(item));
  }

  public static matchRange(
    a: number,
    min: number | undefined,
    max: number | undefined,
  ): boolean {
    if (!min && !max) {
      return true;
    }
    if (min && a < min) {
      return false;
    }
    if (max && a > max) {
      return false;
    }
    return true;
  }
}