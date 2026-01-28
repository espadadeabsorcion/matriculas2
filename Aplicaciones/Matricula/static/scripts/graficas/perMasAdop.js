var pers = document.getElementById('perMasAdop');
var chartPerMasAdop = echarts.init(pers);
var optionPers;

function graficaPerMasAdop(fechInicio = null, fechFin = null) {
    chartPerMasAdop.showLoading({ text: 'Cargando' });
    let fechas = {}
    if (fechInicio && fechFin) {
        fechas = {
            'fechInicio': fechInicio,
            'fechFin': fechFin
        }
    }

    fetch('/graficaPerMasAdop/', {
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
                optionPers = {
                    title: {
                        text: data.nombre,
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left'
                    },
                    series: [
                        {
                            name: 'Especie',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            center: ['50%', '70%'],
                            // adjust the start and end angle
                            startAngle: 180,
                            endAngle: 360,
                            data: data.info
                        }
                    ]
                }
                chartPerMasAdop.hideLoading();
                chartPerMasAdop.setOption(optionPers);
            }
        })
}
graficaPerMasAdop();