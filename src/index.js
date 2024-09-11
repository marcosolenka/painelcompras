const apiUrl = "http://localhost:3030/api/purchaseshipments";
let purchaseshipments = [];

//FAZ A REQUISIÇÃO DOS DADOS PARA API E TRATA OS ERROS
$.get(apiUrl)
  .done(function (data) {
    $.each(data, function (index, item) {
      const valoresItem = {
        nr_solic_compra: item.nr_solic_compra,
        nr_item_solic_compra: item.nr_item_solic_compra,
        cd_material: item.cd_material,
        ds_material: item.ds_material,
        cd_unidade_medida_compra: item.cd_unidade_medida_compra,
        qt_material: item.qt_material,
        dt_solic_item: item.dt_solic_item,
        cd_estabelecimento: item.cd_estabelecimento,
        cd_pessoa_solicitante: item.cd_pessoa_solicitante,
        cd_pessoa_autoriza: item.cd_pessoa_autoriza,
        cd_local_estoque: item.cd_local_estoque,
        cd_centro_custo: item.cd_centro_custo,
        cd_setor_atendimento: item.cd_setor_atendimento,
        dt_liberacao: item.dt_liberacao,
        dt_baixa: item.dt_baixa,
        dt_autorizacao: item.dt_autorizacao,
        tipo_compra: item.tipo_compra,
        dt_recebimento: item.dt_recebimento,
        ordem_compra: item.ordem_compra,
        tipo_ordem_compra: item.tipo_ordem_compra,
        cot_compra: item.cot_compra,
        vl_unitario_prev_cot: item.vl_unitario_prev_cot,
        vl_unit_oc: item.vl_unit_oc,
      };

      purchaseshipments.push(valoresItem);
    });

    console.log(purchaseshipments);
  })
  .fail(function (jqXHR, textStatus, errorThrown) {
    console.error("Erro ao consumir a API:", errorThrown);

    $("#modal").load("./app/pages/painel/erroLeituraAPI.html", function () {
      $(this).removeClass("hidden");
      $("#statusErroLeituraAPI").append(
        `Status: ${jqXHR.status} ${jqXHR.statusText} ${jqXHR.responseText}`
      );
    });
  });

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
