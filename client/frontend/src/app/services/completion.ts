import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

export interface CompletionRequest {
  code: string;
  cursorPosition: number;
  language: string;
  maxSuggestions: number;
}

export interface CompletionResponse {
  suggestion: string;
  description: string;
  confidence: number;
  source: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompletionService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getCompletions(request: CompletionRequest): Observable<CompletionResponse[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<CompletionResponse[]>(
      `${this.apiUrl}/complete`,
      request,
      { headers }
    ).pipe(
      catchError(error => {
        console.error('Error getting completions:', error);
        return of([]);
      })
    );
  }

  checkHealth(): Observable<string> {
    return this.http.get(`${this.apiUrl}/health`, { responseType: 'text' });
  }
}