// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}


// Area Chart Example
var ctx = document.getElementById("myAreaChart");
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["13:50:58", "13:50:59", "13:51:00", "13:51:01", "13:51:02", "13:51:03", "13:51:04", "13:51:05", "13:51:06", "13:51:07", "13:51:08", "13:51:09"],
    datasets: [{
      label: "Uso da CPU",
      lineTension: 0.3,
      backgroundColor: "#00568F",
      borderColor: "#00568F",
      pointRadius: 3,
      pointBackgroundColor: "#00568F",
      pointBorderColor: "#00568F",
      pointHoverRadius: 3,
      pointHoverBackgroundColor: "#00568F",
      pointHoverBorderColor: "#00568F",
      pointHitRadius: 10,
      pointBorderWidth: 2,
      data: [30, 38, 39, 58, 75, 31, 49, 45, 69, 87, 92, 87],
    }],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          maxTicksLimit: 5,
          padding: 10,
          // Include a percent sign in the ticks
          callback: function(value, index, values) {
            return number_format(value) + '%';
          }
        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        }
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      intersect: false,
      mode: 'index',
      caretPadding: 10,
      callbacks: {
        label: function(tooltipItem, chart) {
          var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
          return datasetLabel + ': ' + number_format(tooltipItem.yLabel) + '%';
        }
      }
    }
  }
});



b_usuario.innerHTML = sessionStorage.NOME_USUARIO;
    
    let proximaAtualizacao;
        
    window.onload = obterDadosGrafico(1);

    verificar_autenticacao();

    function alterarTitulo(id_dado_cpu ) {
        var tituloTotem = document.getElementById("tituloAquario")
        tituloAquario.innerHTML = "??ltimas medidas de Temperatura e Umidade do <span style='color: #e6005a'>Totem " + id_dado_cpu  + "</span>"
    }

    // O gr??fico ?? constru??do com tr??s fun????es:
    // 1. obterDadosGrafico -> Traz dados do Banco de Dados para montar o gr??fico da primeira vez
    // 2. plotarGrafico -> Monta o gr??fico com os dados trazidos e exibe em tela
    // 3. atualizarGrafico -> Atualiza o gr??fico, trazendo novamente dados do Banco

    // Esta fun????o *obterDadosGrafico* busca os ??ltimos dados inseridos em tabela de medidas.
    // para, quando carregar o gr??fico da primeira vez, j?? trazer com v??rios dados.
    // A fun????o *obterDadosGrafico* tamb??m invoca a fun????o *plotarGrafico*

    //     Se quiser alterar a busca, ajuste as regras de neg??cio em src/controllers
    //     Para ajustar o "select", ajuste o comando sql em src/models
    function obterDadosGrafico(id_dado_cpu) {
        alterarTitulo(id)

        if (proximaAtualizacao != undefined) {
            clearTimeout(proximaAtualizacao);
        }

        fetch(`/medidas/ultimas/${id_dado_cpu }`, { cache: 'no-store' }).then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                    resposta.reverse();

                    plotarGrafico(resposta, id_dado_cpu );
                });
            } else {
                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
            .catch(function (error) {
                console.error(`Erro na obten????o dos dados p/ gr??fico: ${error.message}`);
            });
    }

    // Esta fun????o *plotarGrafico* usa os dados capturados na fun????o anterior para criar o gr??fico
    // Configura o gr??fico (cores, tipo, etc), materializa-o na p??gina e, 
    // A fun????o *plotarGrafico* tamb??m invoca a fun????o *atualizarGrafico*
    function plotarGrafico(resposta, id_dado_cpu ) {
        console.log('iniciando plotagem do gr??fico...');

        // Criando estrutura para plotar gr??fico - labels
        let labels = [];
        
        // Criando estrutura para plotar gr??fico - dados
        let dados = {
            labels: labels,
            datasets: [{
                label: 'Umidade',
                data: [],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            },
            {
                label: 'Temperatura',
                data: [],
                fill: false,
                borderColor: 'rgb(199, 52, 52)',
                tension: 0.1
            }]
        };
        
        console.log('----------------------------------------------')
        console.log('Estes dados foram recebidos pela funcao "obterDadosGrafico" e passados para "plotarGrafico":')
        console.log(resposta)
        
        // Inserindo valores recebidos em estrutura para plotar o gr??fico
        for (i = 0; i < resposta.length; i++) {
            var registro = resposta[i];
            labels.push(registro.momento_grafico);
            dados.datasets[0].data.push(registro.umidade);
            dados.datasets[1].data.push(registro.temperatura);
        }
        
        console.log('----------------------------------------------')
        console.log('O gr??fico ser?? plotado com os respectivos valores:')
        console.log('Labels:')
        console.log(labels)
        console.log('Dados:')
        console.log(dados.datasets)
        console.log('----------------------------------------------')
        
        // Criando estrutura para plotar gr??fico - config
        const config = {
            type: 'line',
            data: dados,
        };

        // Adicionando gr??fico criado em div na tela
        let myChart = new Chart(
            document.getElementById('myChart'),
            config
        );

        setTimeout(() => atualizarGrafico(idAquario, dados, myChart), 2000);
    }


    // Esta fun????o *atualizarGrafico* atualiza o gr??fico que foi renderizado na p??gina,
    // buscando a ??ltima medida inserida em tabela contendo as capturas, 

    //     Se quiser alterar a busca, ajuste as regras de neg??cio em src/controllers
    //     Para ajustar o "select", ajuste o comando sql em src/models
    function atualizarGrafico(idAquario, dados, myChart) {

        fetch(`/medidas/tempo-real/${idAquario}`, { cache: 'no-store' }).then(function (response) {
            if (response.ok) {
                response.json().then(function (novoRegistro) {

                    console.log(`Dados recebidos: ${JSON.stringify(novoRegistro)}`);
                    console.log(`Dados atuais do gr??fico:`);
                    console.log(dados);

                    document.getElementById("avisoCaptura").innerHTML = ""

                    if (novoRegistro[0].momento_grafico == dados.labels[dados.labels.length - 1]) {
                        console.log("---------------------------------------------------------------")
                        console.log("Como n??o h?? dados novos para captura, o gr??fico n??o atualizar??.")
                        document.getElementById("avisoCaptura").innerHTML = "<i class='fa-solid fa-triangle-exclamation'></i> Foi trazido o dado mais atual capturado pelo sensor. <br> Como n??o h?? dados novos a exibir, o gr??fico n??o atualizar??."
                        console.log("Hor??rio do novo dado capturado:")
                        console.log(novoRegistro[0].momento_grafico)
                        console.log("Hor??rio do ??ltimo dado capturado:")
                        console.log(dados.labels[dados.labels.length - 1])
                        console.log("---------------------------------------------------------------")
                    } else {
                        // tirando e colocando valores no gr??fico
                        dados.labels.shift(); // apagar o primeiro
                        dados.labels.push(novoRegistro[0].momento_grafico); // incluir um novo momento

                        dados.datasets[0].data.shift();  // apagar o primeiro de umidade
                        dados.datasets[0].data.push(novoRegistro[0].umidade); // incluir uma nova medida de umidade

                        dados.datasets[1].data.shift();  // apagar o primeiro de temperatura
                        dados.datasets[1].data.push(novoRegistro[0].temperatura); // incluir uma nova medida de temperatura

                        myChart.update();
                    }

                    // Altere aqui o valor em ms se quiser que o gr??fico atualize mais r??pido ou mais devagar
                    proximaAtualizacao = setTimeout(() => atualizarGrafico(idAquario, dados, myChart), 2000);
                });
            } else {
                console.error('Nenhum dado encontrado ou erro na API');
                // Altere aqui o valor em ms se quiser que o gr??fico atualize mais r??pido ou mais devagar
                proximaAtualizacao = setTimeout(() => atualizarGrafico(idAquario, dados, myChart), 2000);
            }
        })
            .catch(function (error) {
                console.error(`Erro na obten????o dos dados p/ gr??fico: ${error.message}`);
            });

    }

