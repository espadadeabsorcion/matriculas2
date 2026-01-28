var masVie = document.getElementById('masVie');
var charMasVie = echarts.init(masVie)
var optionCharMasVie;

function graficaMasVie(fechInicio = null, fechFin = null) {
    charMasVie.showLoading({ text: 'Cargando' });
    let fechas = {}
    if (fechInicio && fechFin) {
        fechas = {
            'fechInicio': fechInicio,
            'fechFin': fechFin
        }
    }

    fetch('/graficaMasVie/', {
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
                optionCharMasVie = {
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
                    xAxis: { name: 'Años' },
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
                charMasVie.hideLoading();
                charMasVie.setOption(optionCharMasVie);
            }
        })

}
graficaMasVie()