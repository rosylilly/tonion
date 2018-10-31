export interface Header extends Iterable<string> {
  [key: string]: string | string[];
}
