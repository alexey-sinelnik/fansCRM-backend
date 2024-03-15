export default () => ({
  port: process.env.SERVER_PORT,
  secret: process.env.SECRET_JWT,
  expireJwt: process.env.EXPIRE_JWT,
  db_name: process.env.DB_NAME,
  db_user: process.env.DB_USER,
  db_user_password: process.env.DB_USER_PASSWORD,
  db_host: process.env.DB_HOST,
  db_port: process.env.DB_PORT,
});
