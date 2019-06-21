export interface PersistentEntry {
  uid?: string;
}

export interface Category extends PersistentEntry {
  name: string;
}

export interface DbEntry extends PersistentEntry {
  name: string;
  date: string;
  amount: number;
  category: string;
}
