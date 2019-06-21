import { DbEntry } from './intefraces';

export default class EntriesDay {
  hash: string;
  sum: number;
  entries: DbEntry[];

  constructor(dayHash: string, entries: DbEntry[], sum?: number) {
    this.hash = dayHash;
    this.entries = entries;
    this.sum = sum ? sum : 0;
  }

  public static createList(entries: DbEntry[]): EntriesDay[] {
    return EntriesDay.toWebEntries(entries)
      .map(EntriesDay.calculateSum)
      .map(day => {
        day.entries.sort((a, b) => EntriesDay.sortAlphanumeric(a.date, b.date));
        return day;
      })
      .sort((a, b) => EntriesDay.sortAlphanumeric(a.hash, b.hash))
  }

  private static sortAlphanumeric(value1, value2) {
    if (value1 < value2) {
      return 1;
    }
    if (value1 > value2) {
      return -1;
    }
    return 0;
  }

  private static calculateSum(webEntry: EntriesDay): EntriesDay {
    webEntry.sum = webEntry.entries
      .map(el => el.amount)
      .reduce((acc, current) => acc + current, 0);

    return webEntry;
  }

  private static toWebEntries(entries: DbEntry[]) {
    const table = EntriesDay.toEntryExpensesHashTable(entries);

    return Object.keys(table).map(key => {
      const thisKeyEntries = table[key];
      return new EntriesDay(key, thisKeyEntries);
    });
  }

  private static toEntryExpensesHashTable(entries: DbEntry[]): EntryExpensesHashTable {
    const table = {};

    entries.forEach(entry => {
      const key = entry.date.substr(0, 10);

      if (table[key]) {
        table[key].push(entry);
      } else {
        table[key] = [entry];
      }
    });

    return table;
  }
}

interface EntryExpensesHashTable {
  [dayHash: string]: DbEntry[];
}
