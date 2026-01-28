var chartEsp = document.getElementById('especies');
var especies = echarts.init(chartEsp);
var optionEspecies;

function chartEspecies(fechInicio = null, fechFin = null) {
    especies.showLoading({ text: 'Cargando' });

    let fechas = {}
    if (fechInicio && fechFin) {
        fechas = {
            'fechInicio': fechInicio,
            'fechFin': fechFin
        }
    }

    fetch('/graficaEspecies/', {
        method: fechas.fechInicio ? 'POST' : 'GET',
        headers: {
            'Content-Type': 'application/json',
            "X-CSRFToken": getCookie("csrftoken")
        },
        body: fechas.fechInicio ? JSON.stringify(fechas) : null
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.exists) {
                optionEspecies = {
                    dataset: [
                        {
                            dimensions: ['name', 'score'],
                            source: data.info
                        },
                        {
                            transform: {
                                type: 'sort',
                                config: { dimension: 'score', order: 'asc' }
                            }
                        }
                    ],
                    yAxis: {
                        type: 'category',
                        axisLabel: { interval: 0, rotate: 30 }
                    },
                    xAxis: { name: 'Cant.' },
                    series: {
                        type: 'bar',
                        encode: { y: 'name', x: 'score' },
                        datasetIndex: 1,
                        label: {
                            position: 'right',
                            show: true
                        },
                    }
                }
                especies.hideLoading();
                especies.setOption(optionEspecies);
            }
        });
}
chartEspecies();