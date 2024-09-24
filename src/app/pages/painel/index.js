const apiUrl = "http://172.16.28.8:3030/api/purchaseshipments";
let purchaseshipments = [];
//FAZ A REQUISIÇÃO DOS DADOS PARA API, TRATA OS ERROS E ADICIONA OS DADOS PARA A TABELA
getDataAndCreateTable();
setInterval(getDataAndCreateTable(), 600);
function getDataAndCreateTable() {
  $.get(apiUrl)
    .done(function (data) {
      $.each(data, function (index, item) {
        const valoresItem = {
          nr_solic_compra: item.NR_SOLIC_COMPRA,
          nr_item_solic_compra: item.NR_ITEM_SOLIC_COMPRA,
          cd_material: item.CD_MATERIAL,
          ds_material: item.DS_MATERIAL,
          cd_unidade_medida_compra: item.CD_UNIDADE_MEDIDA_COMPRA,
          qt_material: item.QT_MATERIAL,
          dt_solic_item: item.DT_SOLIC_ITEM,
          cd_estabelecimento: item.CD_ESTABELECIMENTO,
          ds_estabelecimento: item.DS_ESTABELECIMENTO,
          cd_pessoa_solicitante: item.CD_PESSOA_SOLICITANTE,
          ds_solicitante: item.DS_SOLICITANTE,
          cd_pessoa_autoriza: item.CD_PESSOA_AUTORIZA,
          ds_pessoa_autoriza: item.DS_PESSOA_AUTORIZA,
          cd_local_estoque: item.CD_LOCAL_ESTOQUE,
          ds_local_estoque: item.DS_LOCAL_ESTOQUE,
          cd_centro_custo: item.CD_CENTRO_CUSTO,
          ds_centro_custo: item.DS_CENTRO_CUSTO,
          cd_setor_atendimento: item.CD_SETOR_ATENDIMENTO,
          ds_setor: item.DS_SETOR,
          dt_liberacao: item.DT_LIBERACAO,
          dt_baixa: item.DT_BAIXA,
          dt_autorizacao: item.DT_AUTORIZACAO,
          tipo_compra: item.TIPO_COMPRA,
          dt_recebimento: item.DT_RECEBIMENTO,
          ordem_compra: item.ORDEM_COMPRA,
          tipo_ordem_compra: item.TIPO_ORDEM_COMPRA,
          cot_compra: item.COT_COMPRA,
          vl_unitario_prev_cot: item.VL_UNITARIO_PREV_COT,
          vl_unit_oc: item.VL_UNIT_OC,
          status: null,
        };

        /* 3 = SOLICITACAO BAIXADA 2 = TEM COTACAO 1 = TEM ORDEM COMPRA 0 = ABERTA  */
        if (item.DT_BAIXA) {
          valoresItem.status = 3;
        } else if (item.ORDEM_COMPRA === null) {
          valoresItem.status = 0;
        } else if (item.ORDEM_COMPRA && !item.COT_COMPRA) {
          valoresItem.status = 1;
        } else if (item.ORDEM_COMPRA && item.COT_COMPRA && !item.DT_BAIXA) {
          valoresItem.status = 2;
        }

        purchaseshipments.push(valoresItem);
      });
      addDataToRequestTable();
      addDataToRequestTableCards();

      //FUNÇÃO RESPONSAVEL POR APLICAR O PLUGIN DATATABLE DO JQUERY PARA VISUALIZACAO DA TABELA PURCHASESHIPMENTSTABLE
      $(document).ready(function () {
        var table = $("#purchaseShipmentsTable").DataTable({
          scrollX: false,
          responsive: true,
          autoWidth: true,
          paging: true,
          pageLength: 10,
          ordering: true,
          pagingType: "full_numbers",
          order: [[6, "desc"]],
          language: {
            lengthMenu: "Mostrando _MENU_ registros por página",
            zeroRecords: "Nada Encontrado",
            info: "Mostrando página _PAGE_ de _PAGES_",
            infoEmpty: "Nenhum dado Disponível",
            infoFiltered: "Filtrado de _MAX_ registros no total",
            search: "Pesquisar:",
            paginate: {
              previous: "<",
              next: ">",
            },
          },
          initComplete: function () {
            applyCustomStyles();
          },
          drawCallback: function () {
            applyCustomStyles();
          },
        });
        $(window).on("resize", function () {
          table.columns.adjust();
          applyCustomStyles();
        });
      });
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      $("#modal").load(
        "/src/app/pages/painel/erroLeituraAPI.html",
        function () {
          $(this).removeClass("hidden");
          $("#statusErroLeituraAPI").append(`Status: ${jqXHR.responseText}`);
        }
      );
    });
}
function addDataToRequestTableCards() {
  const uniqueShipments = purchaseshipments.filter(
    (item, index, self) =>
      index ===
      self.findIndex((t) => t.nr_solic_compra === item.nr_solic_compra)
  );

  let sumValuesOpened = 0;
  let sumValuesInProgress = 0;
  let sumValuesEnded = 0;

  $.each(uniqueShipments, function (index, item) {
    if (item.status === 0) {
      sumValuesOpened++;
    } else if (item.status === 1 || item.status === 2) {
      sumValuesInProgress++;
    } else if (item.status === 3) {
      sumValuesEnded++;
    }
  });

  console.log(sumValuesOpened);
  console.log(sumValuesInProgress);
  console.log(sumValuesEnded);

  $("#openedRequestsCard").append(sumValuesOpened);
  $("#inProgressRequestsCard").append(sumValuesInProgress);
  $("#endedRequestsCard").append(sumValuesEnded);
}

function addDataToRequestTable() {
  $("#purchaseShipmentsData").find("tr:gt(0)").remove();

  // Filtrar itens únicos com base na propriedade 'nr_solic_compra'
  const uniqueShipments = purchaseshipments.filter(
    (item, index, self) =>
      index ===
      self.findIndex((t) => t.nr_solic_compra === item.nr_solic_compra)
  );

  uniqueShipments.sort((a, b) => b.nr_solic_compra - a.nr_solic_compra);

  $.each(uniqueShipments, function (index, item) {
    if (item.status != 3 && item.cd_estabelecimento === 6) {
      const datePart = item.dt_liberacao.split("T")[0];
      const [year, month, day] = datePart.split("-");
      const formattedDate = `${day}/${month}/${year}`;

      const tipoCompra = item.tipo_compra ? item.tipo_compra : "Não Informado";
      let upperSolicitante = capitalizeWords(item.ds_solicitante);
      let upperSetor = item.ds_centro_custo
        ? item.ds_centro_custo
        : item.ds_local_estoque;
      let upperTipoCompra = capitalizeWords(tipoCompra);

      let statusText;
      switch (item.status) {
        case 3:
          statusText = "Solicitação Baixada";
          break;
        case 2:
          statusText = "Tem cotação";
          break;
        case 1:
          statusText = "Tem Ordem Compra";
          break;
        case 0:
          statusText = "Aberta";
          break;
        default:
          statusText = "Desconhecido";
      }

      const newRow = `
        <tr class="bg-white">
          <td class="px-6 py-4 whitespace-nowrap text-sm">${item.nr_solic_compra}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">${formattedDate}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">${upperSolicitante}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">${upperSetor}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">${upperTipoCompra}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">${statusText}</td>
        </tr>
      `;
      $("#purchaseShipmentsData").append(newRow);
    }
  });
}

//FECHA O MODAL AO CLICAR NO X
$(document).on("click", "#icone-fechar", function (event) {
  event.preventDefault();
  $("#modal").addClass("hidden");
});

//FECHA O MODAL AO CLICAR EM QUALQUER ESPAÇO DA TELA FORA DO MODAL
$(window).on("click", function (event) {
  if ($(event.target).is("#modal")) {
    $("#modal").addClass("hidden");
  }
});

function capitalizeWords(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function applyCustomStyles() {
  // $("#purchaseShipmentsTable_wrapper").find("label").addClass("text-white");
  $(".dt-search").addClass("flex justify-end space-x-2 -mt-6");
  $(".dt-length").addClass("flex space-x-2 text-white");
  $(".dt-search").find("label").addClass("text-white");
  $("#purchaseShipmentsTable_wrapper").find(".dt-layout-row").addClass("p-2");

  $("#purchaseShipmentsTable_wrapper")
    .find("select")
    .addClass("text-black mx-2");
  $(".dt-paging").addClass("text-white");
  $(".dt-paging")
    .find("nav")
    .addClass("flex justify-end space-x-2")
    .children()
    .addClass(
      "flex justify-end hover:bg-purple-700 py-2 px-4 bg-purple-800 border rounded-md"
    );
  $("#purchaseShipmentsTable_info").addClass("text-gray-300 text-sm");
}
