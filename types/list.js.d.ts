declare module 'list.js' {
  interface ListOptions {
    valueNames?: (string | { name: string; attr: string })[];
    item?: string;
    listClass?: string;
    searchClass?: string;
    sortClass?: string;
    indexAsync?: boolean;
    page?: number;
    i?: number;
    pagination?: boolean;
    fuzzySearch?: {
      searchClass?: string;
      location?: number;
      distance?: number;
      threshold?: number;
      multiSearch?: boolean;
    };
    searchColumns?: string[];
    sortFunction?: (a: any, b: any, options: any) => number;
  }

  interface ListItem {
    values(): Record<string, any>;
    elm: HTMLElement;
    filtered: boolean;
    matching: boolean;
  }

  class List {
    constructor(element: string | HTMLElement, options?: ListOptions);
    add(values: Record<string, any>, callback?: () => void): void;
    remove(name: string, value: any): number;
    get(name: string, value: any): ListItem[];
    sort(name: string, options?: { order?: 'asc' | 'desc', sortFunction?: (a: any, b: any) => number }): void;
    search(searchString: string, columns?: string[]): void;
    clear(): void;
    filter(filterFunction?: (item: ListItem) => boolean): void;
    size(): number;
    show(i: number, page: number): void;
    update(): void;
    reIndex(): void;
    fuzzySearch(searchString: string, columns?: string[]): void;
    on(event: string, callback: (...args: any[]) => void): void;
    destroy(): void;
    items: ListItem[];
    visibleItems: ListItem[];
    matchingItems: ListItem[];
    searched: boolean;
    filtered: boolean;
    list: HTMLElement;
  }

  export default List;
} 