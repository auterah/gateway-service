import { OnModuleInit } from '@nestjs/common';

export type EmitEvent<P> = {
  ev: string;
  payload: P;
};

export interface IEvemitterService<P> extends OnModuleInit {
  emitEvent(evOpts: EmitEvent<P>): void;
}
