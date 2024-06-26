import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TerraformState } from './models/terraform-state.model';

@Injectable({
  providedIn: 'root'
})
export class TerraformStateService {
  constructor(private http: HttpClient) {}

  getStateFile(source: 'aws' | 'azure', config: any): Observable<TerraformState> {
    switch (source) {
      case 'aws':
        return this.getAwsStateFile(config);
      case 'azure':
        return this.getAzureStateFile(config);
      default:
        throw new Error('Invalid source specified');
    }
  }

  private getAwsStateFile(config: { bucket: string, key: string, region: string }): Observable<TerraformState> {
    // This is a mock implementation. In a real scenario, you'd need to use AWS SDK or a backend API.
    const url = `https://${config.bucket}.s3.${config.region}.amazonaws.com/${config.key}`;
    return this.http.get<TerraformState>(url).pipe(
      catchError(this.handleError<TerraformState>('getAwsStateFile', {} as TerraformState))
    );
  }

  private getAzureStateFile(config: { storageAccount: string, container: string, key: string }): Observable<TerraformState> {
    // This is a mock implementation. In a real scenario, you'd need to use Azure SDK or a backend API.
    const url = `https://${config.storageAccount}.blob.core.windows.net/${config.container}/${config.key}`;
    return this.http.get<TerraformState>(url).pipe(
      catchError(this.handleError<TerraformState>('getAzureStateFile', {} as TerraformState))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}