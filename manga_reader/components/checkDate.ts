type DateObj = {
  year: number;
  month: number;
  date: number;
};

export class DateVerifier {
  private isLeap(year: number): boolean {
    return new Date(year, 1, 29).getDate() === 29;
  }

  public isDateValid(
    date: string,
    yearRangeStart?: number,
    yearRangeEnd?: number,
  ): boolean {
    const splitted = date.split('-');
    if (splitted.length < 3) {
      return false;
    }
    const year = Number.parseInt(splitted[0], 10);
    const month = Number.parseInt(splitted[1], 10);
    const day = Number.parseInt(splitted[2], 10);
    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
      return false;
    }
    if (yearRangeStart) {
      if (year < yearRangeStart) {
        return false;
      }
    }
    if (yearRangeEnd) {
      if (year > yearRangeEnd) {
        return false;
      }
    }
    if (year < 0 || month < 0 || day < 0) {
      return false;
    }
    if (!(month > 0 && month < 13)) {
      return false;
    }
    if (this.isLeap(year)) {
      if (month === 2 && !(day > 0 && day < 30)) {
        return false;
      }
    }
    if (!this.isLeap(year)) {
      if (month === 2 && !(day > 0 && day < 29)) {
        return false;
      }
    }
    if (
      month === 1 ||
      month === 3 ||
      month === 5 ||
      month === 7 ||
      month === 8 ||
      month === 10 ||
      month === 12
    ) {
      if (!(day > 0 && day < 32)) {
        return false;
      }
    }
    if (month === 4 || month === 6 || month === 9 || month === 11) {
      if (!(day > 0 && day < 31)) {
        return false;
      }
    }
    return true;
  }

  public isNumberDateValid(
    year: number,
    month: number,
    day: number,
    yearRangeStart?: number,
    yearRangeEnd?: number,
  ): boolean {
    if (yearRangeStart) {
      if (year < yearRangeStart) {
        return false;
      }
    }
    if (yearRangeEnd) {
      if (year > yearRangeEnd) {
        return false;
      }
    }
    if (year < 0 || month < 0 || day < 0) {
      return false;
    }
    if (!(month > 0 && month < 13)) {
      return false;
    }
    if (this.isLeap(year)) {
      if (month === 2 && !(day > 0 && day < 30)) {
        return false;
      }
    }
    if (!this.isLeap(year)) {
      if (month === 2 && !(day > 0 && day < 29)) {
        return false;
      }
    }
    if (
      month === 1 ||
      month === 3 ||
      month === 5 ||
      month === 7 ||
      month === 8 ||
      month === 10 ||
      month === 12
    ) {
      if (!(day > 0 && day < 32)) {
        return false;
      }
    }
    if (month === 4 || month === 6 || month === 9 || month === 11) {
      if (!(day > 0 && day < 31)) {
        return false;
      }
    }
    return true;
  }

  public getNumbers(date: string): DateObj | null {
    if (!this.isDateValid(date)) {
      return null;
    } else {
      const splitted = date.split('-');
      return {
        year: Number.parseInt(splitted[0], 10),
        date: Number.parseInt(splitted[2], 10),
        month: Number.parseInt(splitted[1], 10),
      };
    }
  }

  public isBeforeThan(before: string, than: string, strict?: boolean): boolean {
    const beforeNums = this.getNumbers(before);
    const thanNums = this.getNumbers(than);
    if (!beforeNums || !thanNums) {
      throw 'Invalid dates!';
    } else {
      if (beforeNums.year > thanNums.year) {
        return false;
      } else if (beforeNums.year < thanNums.year) {
        return true;
      } else {
        if (beforeNums.month > thanNums.month) {
          return false;
        } else if (beforeNums.month < thanNums.month) {
          return true;
        } else {
          if (beforeNums.date > thanNums.date) {
            return false;
          } else if (beforeNums.date < thanNums.date) {
            return true;
          } else {
            return strict ? false : true;
          }
        }
      }
    }
  }
}
