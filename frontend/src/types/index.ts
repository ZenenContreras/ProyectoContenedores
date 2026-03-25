export interface MicroserviceReq {
  name: string;
  language: string;
  code: string;
}

export interface Container {
  id: string;
  name: string;
  status: string;
  state: string;
  ports: string;
}