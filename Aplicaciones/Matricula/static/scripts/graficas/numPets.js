// Inicializamos la grafica
var chartNumPets = document.getElementById('numPets');
var NumPets = echarts.init(chartNumPets);
var optionNumPets;
// Creamos una fucino que reciba los parametros de incio y fin para el selector de fechas
// Ponemos null porque son valores opcionales
function NumeroMascotas(fechInicio = null, fechFin = null) {
    // Ponemos un cargando en la grafica
    NumPets.showLoading({ text: 'Cargando' });

    // Este json lo vamos a pasar en caso de que si haya fechas en las variables
    let fechas = {}
    if (fechInicio && fechFin) {
        // Si las variables estan llenas pasamos los datos
        fechas = {
            'fechInicio': fechInicio,
            'fechFin': fechFin,
        }
    }

    // Realizamos un fetch, que va a consultar cada vez que se recargue la pagina o cuando pongamos fechas
    fetch('/graficaNumPets/', {
        // Aqui tenemos que especificar el metodo, en caso de que tengamos fechas sera POST caso contrario GET
        method: fechas.fechInicio ? 'POST' : 'GET',
        headers: {
            'Content-Type': 'application/json',
            "X-CSRFToken": getCookie("csrftoken")
        },
        // Aqui lo mismo si hay fechas mandamos un json con las fechas, caso contrario el body es null
        body: fechas.fechInicio ? JSON.stringify(fechas) : null
    })
        // Aqui estamos diciendo que la respuesta va a convertirse en un json (creo xd)
        .then((res) => res.json())
        // Despues de eso res es data y aqui vamos a incrustar los datos que hayamos recibido del backend (views)
        .then((data) => {
            if (data.exists) {
                // Damos las configuracinoes al grafico
                optionNumPets = {
                    // title: {
                    //     text: 'Número total de animales adoptados y no adoptados',
                    //     left: 'center'
                    // },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left'
                    },
                    series: [
                        {
                            name: 'Mascotas',
                            type: 'pie',
                            radius: '50%',
                            // Aqui insertamos los datos que consultamos
                            data: data.info,
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                // Ocultamos el icono de carga porque ya cargo los daots
                NumPets.hideLoading();
                // cargamos el grafico con los datos de las opciones
                NumPets.setOption(optionNumPets);
            }
        })
}
// Llamamos al funcion sin datos ya que esto es lo que va a cargar cuando la pagina se muestre
NumeroMascotas()