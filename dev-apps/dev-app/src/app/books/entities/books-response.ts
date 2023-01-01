export interface BooksResponseItemVolumeImageLinks {
  smallThumbnail?: string;
  thumbnail?: string;
}

export interface BooksResponseItemVolume {
  title: string;
  subtitle: string;
  authors: string[];
  description: string;
  imageLinks: BooksResponseItemVolumeImageLinks;
}

export interface BooksResponseItem {
  id: string;
  volumeInfo: BooksResponseItemVolume;
}

export interface BooksResponse {
  totalItems: number;
  items: BooksResponseItem[];
}
