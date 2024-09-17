import express from "express";
import { getConnection } from "./dbconnection.js";
import cors from "cors";
import oracledb from "oracledb";

const app = express();
const port = 3030;
let purchaseshipmentsSQL = `select * from hsvp_solic_compras`;

app.use(cors());
app.use(express.json());

async function getPurchaseShipments(req, res) {
  try {
    const dbConnection = await getConnection();
    const result = await dbConnection.execute(purchaseshipmentsSQL, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    res.json(result.rows);
  } catch (error) {
    console.log(
      "Não foi possivel recuperar os dados da solicitação de compras",
      error
    );

    res.status(500).json({ error: "Não foi possível recuperar os dados" });
  }
}

app.get("/api/purchaseshipments", getPurchaseShipments);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
