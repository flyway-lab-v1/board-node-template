import mysql from "mysql2/promise";
import { createApp } from "./app.js";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const port = Number(process.env.PORT ?? 3000);
createApp(pool).listen(port, () => {
  console.log(`서버 실행: http://localhost:${port}`);
});
