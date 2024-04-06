interface IGlobal<E> {
  set(e: E): void;
  get(): E;
}

export const GDefaultBilling: IGlobal<number> = {
  set(cost: number) {
    global.DEFAUL_BILLING = cost;
  },
  get() {
    return global.DEFAUL_BILLING;
  },
};
