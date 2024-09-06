import oracledb from "oracledb";
import dotenv from "dotenv";

dotenv.config();

async function getConnection() {
  try {
    const libDir = process.env.ORACLE_CLIENT_LIB_DIR;
    const user = process.env.ORACLE_USER;
    const password = process.env.ORACLE_PASSWORD;
    const connectString = process.env.ORACLE_CONNECT_STRING;

    if (!libDir) {
      throw new Error("Variável de ambiente ORACLE não definida");
    }

    oracledb.initOracleClient({ libDir });

    const connection = await oracledb.getConnection({
      user: user,
      password: password,
      connectString: connectString,
    });
    return connection;
  } catch (err) {
    throw err;
  }
}

export { getConnection };
