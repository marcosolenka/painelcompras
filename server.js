import express from "express";
import { getConnection } from "./dbconnection.js";
import cors from "cors";
import oracledb from "oracledb";

const app = express();
const port = 3000;

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

let purchaseshipmentsSQL = `
select
  nr_solic_compra,
  nr_item_solic_compra,
  cd_material,
  ds_material,
  cd_unidade_medida_compra,
  qt_material,
  dt_solic_item,
  cd_estabelecimento,
  cd_pessoa_solicitante,
  cd_pessoa_autoriza,
  cd_local_estoque,
  cd_centro_custo,
  cd_setor_atendimento,
  dt_liberacao,
  dt_baixa,
  dt_autorizacao,
  tipo_compra,
  dt_recebimento,
  ordem_compra,
  tipo_ordem_compra,
  cot_compra,
  vl_unitario_prev_cot,
  vl_unit_oc
from
  hsvp_solic_compras`;
