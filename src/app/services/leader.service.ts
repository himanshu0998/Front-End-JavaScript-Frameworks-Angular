import { Injectable } from '@angular/core';
import { LEADERS } from '../shared/leaders';
import { Leader } from '../shared/leader';
import { Observable,of } from 'rxjs';
import { map,delay } from 'rxjs/operators';
import { baseURL } from '../shared/baseurl';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class LeaderService {

  constructor(private http: HttpClient) { }

  getLeaders(): Observable<Leader[]> {
    return this.http.get<Leader[]>(baseURL + 'leaders');
  }

  getLeader(id: string): Observable<Leader>
  {
    return this.http.get<Leader>(baseURL+'leaders/'+id);
  }

  // getFeaturedLeader(): Promise<Leader>
  // {
  //   return new Promise(resolve => {
  //     setTimeout(()=>(LEADERS.filter((leader)=>(leader.featured))[0]),2000);
  //   });
  // }
  getFeaturedLeader(): Observable<Leader> {
    // return newPromise.resolve(LEADERS.filter((leader) => leader.featured)[0]);
    return this.http.get<Leader>(baseURL + "leaders?featured=true")
      .pipe(map( leaders => leaders[0]));
  }
}
