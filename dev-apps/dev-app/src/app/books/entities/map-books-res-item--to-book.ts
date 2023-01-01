import { Book } from './book';
import { BooksResponseItem } from './books-response';

export function mapBooksResItemToBook(item: BooksResponseItem): Book {
  return {
    title: item.volumeInfo.title,
    subtitle: item.volumeInfo.subtitle,
    description: item.volumeInfo.description,
    authors: item.volumeInfo.authors ? [...item.volumeInfo.authors] : [],
    id: item.id,
    imageLinks: item.volumeInfo.imageLinks,
  };
}
