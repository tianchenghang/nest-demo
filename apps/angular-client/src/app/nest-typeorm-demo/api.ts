import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface ICond {
  partialName: string;
  page: number;
  pageSize: number;
}

export interface IPeople {
  id: number;
  name: string;
  age: number;
  emailList?: { addr: string }[];
}

interface IRes {
  data: unknown;
  code: number;
  message: string;
}

export interface IEmail {
  peopleId: number;
  addr: string;
}

@Injectable({
  providedIn: 'root',
})
export class Api {
  http = inject<HttpClient>(HttpClient);
  insertPeople(people: IPeople) {
    return this.http.post<IRes>('/people', people);
  }

  fetchPeopleList(cond: ICond) {
    return this.http.get<IRes>('/people', { params: { ...cond } });
  }

  updatePeople(people: Partial<IPeople> & { id: number }) {
    return this.http.patch<IRes>(`/people/${people.id}`, people)
  }

  deletePeople(id: number) {
    return this.http.delete<IRes>(`/people/${id}`)
  }

  addPeopleEmail(email: IEmail) {
    return this.http.post<IRes>('/people/email', email)
  }

  swapEmailAddr(addrList: [string, string]) {
    return this.http.post<IRes>('/people/swapEmailAddr', addrList)
  }
}
