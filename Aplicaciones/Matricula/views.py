from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Curso, Matricula, Instructor
# Create your views here.

def index(request):
    cursos = Curso.objects.all()
    cursos_activos = sum(1 for curso in cursos if curso.estadoCurso == 'Activo' or curso.estadoCurso == 'activo')
    contexto = {
        'cursos': cursos,
        'cursos_activos': cursos_activos
    }
    return render(request, 'index.html', contexto)

def nuevo_curso(request):
    instructores = Instructor.objects.all()
    if request.method == 'POST':
        try:
            nombre = request.POST['nombre']
            area = request.POST['area']
            duracion = request.POST['duracion']
            cupo = request.POST['cupo']
            estado = request.POST['estado']
            instructor = request.POST.get('instructor', None)

            nuevo_curso = Curso(
                nombreCurso=nombre,
                areaCurso=area,
                duracionCurso=duracion,
                cupoMaxCurso=cupo,
                estadoCurso=estado,
                instructorCurso=Instructor.objects.get(cedulaInstructor=instructor) if instructor else None
            )
            nuevo_curso.save()
            messages.success(request, f'Curso "{nombre}" creado exitosamente.')
            return redirect('index')
        except Exception as e:
            messages.error(request, f'Error al crear el curso: {str(e)}')
            return render(request, 'nuevoCurso.html', {'instructores': instructores})
    return render(request, 'nuevoCurso.html', {'instructores': instructores})

def editar_curso(request, codigoCurso):
    curso = Curso.objects.get(codigoCurso=codigoCurso)
    instructores = Instructor.objects.all()
    if request.method == 'POST':
        try:
            curso.nombreCurso = request.POST['nombre']
            curso.areaCurso = request.POST['area']
            curso.duracionCurso = request.POST['duracion']
            curso.cupoMaxCurso = request.POST['cupo']
            curso.estadoCurso = request.POST['estado']
            instructor = request.POST.get('instructor', None)
            curso.instructorCurso = Instructor.objects.get(cedulaInstructor=instructor) if instructor else None
            curso.save()
            messages.success(request, f'Curso "{curso.nombreCurso}" actualizado exitosamente.')
            return redirect('index')
        except Exception as e:
            messages.error(request, f'Error al actualizar el curso: {str(e)}')
            return render(request, 'editarCurso.html', {'curso': curso, 'instructores': instructores})
    return render(request, 'editarCurso.html', {'curso': curso, 'instructores': instructores})

def eliminar_curso(request, codigoCurso):
    try:
        curso = Curso.objects.get(codigoCurso=codigoCurso)
        nombre_curso = curso.nombreCurso
        if request.method == 'POST':
            curso.delete()
            messages.success(request, f'Curso "{nombre_curso}" eliminado exitosamente.')
            return redirect('index')
        return render(request, 'index.html', {'curso': curso})
    except Exception as e:
        messages.error(request, f'Error al eliminar el curso: {str(e)}')
        return redirect('index')

def lista_matriculas(request):
    matriculas = Matricula.objects.all()
    contexto = {'matriculas': matriculas}
    return render(request, 'listaSolicitudes.html', contexto)

def nueva_matricula(request):
    if request.method == 'POST':
        try:
            nombre = request.POST['nombreEstudiante']
            documento = request.POST['documentoEstudiante']
            fecha = request.POST['fechaMatricula']
            curso_id = request.POST['cursoMatricula']
            curso = Curso.objects.get(codigoCurso=curso_id)
            
            if curso.cupoMaxCurso <= 0:
                messages.warning(request, f'El curso "{curso.nombreCurso}" no tiene cupos disponibles.')
                return redirect('nueva_matricula')
            
            curso.cupoMaxCurso -= 1
            if curso.cupoMaxCurso <= 0:
                curso.cupoMaxCurso = 0
                curso.estadoCurso = 'inactivo'
            curso.save()
            
            nueva_matricula = Matricula(
                nombreEstudiante=nombre,
                documentoEstudiante=documento,
                fechaMatricula=fecha,
                cursoMatricula=curso
            )
            nueva_matricula.save()
            messages.success(request, f'Matrícula de "{nombre}" registrada exitosamente en el curso "{curso.nombreCurso}".')
            return redirect('lista_matriculas')
        except Exception as e:
            messages.error(request, f'Error al registrar la matrícula: {str(e)}')
            return redirect('nueva_matricula')
    cursos = Curso.objects.all()
    return render(request, 'nuevaSolicitud.html', {'cursos': cursos})

def editar_matricula(request, matricula_id):
    matricula = Matricula.objects.get(codigoMatricula=matricula_id)
    if request.method == 'POST':
        try:
            matricula.nombreEstudiante = request.POST['nombreEstudiante']
            matricula.documentoEstudiante = request.POST['documentoEstudiante']
            matricula.fechaMatricula = request.POST['fechaMatricula']
            curso_id = request.POST['cursoMatricula']
            matricula.cursoMatricula = Curso.objects.get(codigoCurso=curso_id)
            matricula.save()
            messages.success(request, f'Matrícula de "{matricula.nombreEstudiante}" actualizada exitosamente.')
            return redirect('lista_matriculas')
        except Exception as e:
            messages.error(request, f'Error al actualizar la matrícula: {str(e)}')
            return render(request, 'editarSolicitud.html', {'matricula': matricula, 'cursos': Curso.objects.all()})
    cursos = Curso.objects.all()
    return render(request, 'editarSolicitud.html', {'matricula': matricula, 'cursos': cursos})

def eliminar_matricula(request, matricula_id):
    try:
        matricula = Matricula.objects.get(codigoMatricula=matricula_id)
        nombre_estudiante = matricula.nombreEstudiante
        matricula.cursoMatricula.cupoMaxCurso += 1
        matricula.cursoMatricula.estadoCurso = 'activo'
        matricula.cursoMatricula.save()
        if request.method == 'POST':
            matricula.delete()
            messages.success(request, f'Matrícula de "{nombre_estudiante}" eliminada exitosamente.')
            return redirect('lista_matriculas')
        return render(request, 'listaSolicitudes.html', {'matricula': matricula})
    except Exception as e:
        messages.error(request, f'Error al eliminar la matrícula: {str(e)}')
        return redirect('lista_matriculas')

def reporte_matriculas(request):
    cursos = Curso.objects.all()
    reporte = []
    for curso in cursos:
        matriculados = Matricula.objects.filter(cursoMatricula=curso).count()
        disponibles = curso.cupoMaxCurso - matriculados
        reporte.append({
            'nombre': curso.nombreCurso,
            'area': curso.areaCurso,
            'cupo_max': curso.cupoMaxCurso,
            'matriculados': matriculados,
            'disponibles': disponibles
        })
    contexto = {'reporte': reporte}
    return render(request, 'reporte.html', contexto)

def lista_instructores(request):
    instructores = Instructor.objects.all()
    contexto = {'instructores': instructores}
    return render(request, 'listaInstructor.html', contexto)

def nuevo_instructor(request):
    if request.method == 'POST':
        try:
            cedula = request.POST['cedulaInstructor']
            nombre = request.POST['nombreInstructor']
            apellido = request.POST['apellidoInstructor']
            titulacion = request.POST['titulacionInstructor']
            foto = request.FILES.get('fotoInstructor')

            nuevo_instructor = Instructor(
                cedulaInstructor=cedula,
                nombreInstructor=nombre,
                apellidoInstructor=apellido,
                titulacionInstructor=titulacion,
                fotoInstructor=foto
            )
            nuevo_instructor.save()
            messages.success(request, f'Instructor "{nombre} {apellido}" creado exitosamente.')
            return redirect('lista_instructores')
        except Exception as e:
            messages.error(request, f'Error al crear el instructor: {str(e)}')
            return render(request, 'nuevoInstructor.html')
    return render(request, 'nuevoInstructor.html')

def editar_instructor(request, cedulaInstructor):
    instructor = Instructor.objects.get(cedulaInstructor=cedulaInstructor)
    if request.method == 'POST':
        try:
            instructor.nombreInstructor = request.POST['nombreInstructor']
            instructor.apellidoInstructor = request.POST['apellidoInstructor']
            instructor.titulacionInstructor = request.POST['titulacionInstructor']
            if 'fotoInstructor' in request.FILES:
                instructor.fotoInstructor = request.FILES['fotoInstructor']
            instructor.save()
            messages.success(request, f'Instructor "{instructor.nombreInstructor} {instructor.apellidoInstructor}" actualizado exitosamente.')
            return redirect('lista_instructores')
        except Exception as e:
            messages.error(request, f'Error al actualizar el instructor: {str(e)}')
            return render(request, 'editarInstructor.html', {'instructor': instructor})
    return render(request, 'editarInstructor.html', {'instructor': instructor})

def eliminar_instructor(request, cedulaInstructor):
    try:
        instructor = Instructor.objects.get(cedulaInstructor=cedulaInstructor)
        nombre_instructor = f"{instructor.nombreInstructor} {instructor.apellidoInstructor}"
        if request.method == 'POST':
            instructor.delete()
            messages.success(request, f'Instructor "{nombre_instructor}" eliminado exitosamente.')
            return redirect('lista_instructores')
        return render(request, 'listaInstructor.html', {'instructor': instructor})
    except Exception as e:
        messages.error(request, f'Error al eliminar el instructor: {str(e)}')
        return redirect('lista_instructores')
