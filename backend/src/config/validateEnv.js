import Joi from 'joi';

const envSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  PORT: Joi.number().default(5000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  API_URL: Joi.string().uri().optional(),
}).unknown();

export function validateEnv() {
  const { error } = envSchema.validate(process.env);
  if (error) {
    throw new Error(`Environment validation error: ${error.message}`);
  }
}
