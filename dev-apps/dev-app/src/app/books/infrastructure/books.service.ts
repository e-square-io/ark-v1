import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BooksResponse } from '../entities';

const GOOGLE_APIS = 'https://www.googleapis.com/books/v1';

@Injectable()
export class BooksService {
  constructor(private readonly http: HttpClient) {}

  readBooks(q: string, startIndex = 0, maxResults = 10): Observable<BooksResponse> {
    const params = new HttpParams({ fromObject: { q, startIndex, maxResults } });

    return this.http.get<BooksResponse>(`${GOOGLE_APIS}/volumes`, { params });
  }
}
