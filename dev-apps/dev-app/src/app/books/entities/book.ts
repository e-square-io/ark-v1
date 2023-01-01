import { BooksResponseItemVolumeImageLinks } from './books-response';

export interface Book {
  title: string;
  subtitle: string;
  description: string;
  authors: string[];
  id: string;
  imageLinks?: BooksResponseItemVolumeImageLinks;
}
