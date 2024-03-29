enum Environment {
  development = 'development',
  staging = 'staging',
  production = 'production',
  test = 'test',
}

const UPPER_ENVIRONMENTS = [Environment.staging, Environment.production];

const getNodeEnv = (): Environment =>
  Environment[process.env.NODE_ENV as Environment] || Environment.production;

const getProject = (): string | void => process.env.PROJECT || undefined;

const isDevelopment = (): boolean => getNodeEnv() === Environment.development;
const notIsDevelopment = (): boolean => !isDevelopment();

const isProduction = (): boolean => getNodeEnv() === Environment.production;
const notIsProduction = (): boolean => !isProduction();

const isStaging = (): boolean => getNodeEnv() === Environment.staging;
const notIsStaging = (): boolean => !isStaging();

const isUpperEnv = (): boolean => UPPER_ENVIRONMENTS.includes(getNodeEnv());
const isLowerEnv = (): boolean => !isUpperEnv();

export {
  Environment,
  UPPER_ENVIRONMENTS,
  getNodeEnv,
  getProject,
  notIsDevelopment,
  isDevelopment,
  isLowerEnv,
  isProduction,
  notIsStaging,
  isStaging,
  isUpperEnv,
  notIsProduction,
};
