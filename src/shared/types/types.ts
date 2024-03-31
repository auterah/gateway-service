export type RecordId = string | number;

export type SecurityConfig = {
  jwt_secret: string;
};

export type KafkaConfig = {
  brokers: string[];
  groupId: string;
};

export type GenderOptions = 'male' | 'female' | 'others';

export interface RequestPasswordResponse {
  message: string;
}

export interface ValidationError {
  error: string;
  message: string;
}

export interface CalcPaginationType {
  limit: number;
  offset: number;
}

export interface ResultSetMeta {
  limit: number;
  offset: number;
  page: number;
  date1?: any;
  date2?: any;
}

export interface IAuthUser {
  sub: number;
  email: string;
  iat: number;
  exp: number;
}
