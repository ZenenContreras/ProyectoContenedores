export interface MicroserviceReq {
  name: string;
  language: string;
  description: string; 
  code: string;
}

export interface Container {
  id: string;
  name: string;
  status: string;
  description: string; 
  state: string;
  ports: string;
}