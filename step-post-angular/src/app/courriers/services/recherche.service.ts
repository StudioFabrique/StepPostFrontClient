import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DetailsCourrier } from '../../core/models/details-courrier-model';
import { RetourCourrier } from '../models/retour-courrier.model';

@Injectable({
  providedIn: 'root',
})
export class RechercheService {
  detailsCourrier$: Subject<DetailsCourrier> = new Subject<DetailsCourrier>();
  baseUrl: string = environment.url.baseUrl;
  timeline!: boolean;

  constructor(private http: HttpClient) {}

  getDetailsCourrier(bordereau: number): void {
    this.http
      .get<any>(
        `${this.baseUrl}/client/recherchecourrier/bordereau?bordereau=${bordereau}`
      )
      .subscribe((response) => this.detailsCourrier$.next(response));
  }

  rechercheByBordereau(bordereau: number): Observable<DetailsCourrier> {
    this.timeline = false;
    return this.http.get<any>(
      `${this.baseUrl}/client/recherchecourrier/bordereau?bordereau=${bordereau}`
    );
  }

  rechercheByName(
    name: string,
    firstname: string | undefined,
    filter: boolean,
    offset: number,
    limit: number
  ): Observable<RetourCourrier[]> {
    return this.http.get<any>(
      `${this.baseUrl}/client/recherchecourrier/nom?name=${name}&firstname=${firstname}&filter=${filter}&offset=${offset}&limit=${limit}`
    );
  }

  sortedRechercheByName(
    name: string,
    firstname: string | undefined,
    filter: boolean,
    offset: number,
    limit: number,
    col: number,
    order: boolean | null
  ): Observable<RetourCourrier[]> {
    return this.http.get<any>(
      `${this.baseUrl}/client/recherchecourrier/nom?name=${name}&firstname=${firstname}&filter=${filter}&offset=${offset}&limit=${limit}&col=${col}&order=${order}`
    );
  }

  updateDetailsCourrier(): Observable<DetailsCourrier> {
    return this.detailsCourrier$.asObservable();
  }

  getNameList(name: string): Observable<any[] | unknown> {
    return this.http
      .get<any | unknown>(
        `${this.baseUrl}/client/recherchecourrier/liste-nom?name=${name}`
      )
      .pipe(
        tap((response) => console.log(response)),
        catchError((error) => this.handleError([]))
      );
  }

  handleError(value: any) {
    return of(value);
  }

  testForSignature(courrier: DetailsCourrier): boolean {
    const statuts = courrier.statuts;
    console.log(statuts[statuts.length - 1].statut_id);

    if (statuts[statuts.length - 1].statut_id === 5) {
      return true;
    }
    return false;
  }
}
