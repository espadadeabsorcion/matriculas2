from django.db import models

# Create your models here.
class Curso(models.Model):
    ESTADO_CHOICES = [
        ('activo' , 'Activo'),
        ('inactivo' , 'Inactivo')]

    codigoCurso = models.AutoField(primary_key=True)
    nombreCurso = models.CharField(max_length=30)
    areaCurso = models.CharField(max_length=30)
    duracionCurso = models.IntegerField()
    cupoMaxCurso = models.IntegerField()
    estadoCurso = models.CharField(max_length=50,choices=ESTADO_CHOICES, default='activo')
    instructorCurso = models.ForeignKey('Instructor', on_delete=models.CASCADE, null=True, blank=True)

class Matricula(models.Model):
    codigoMatricula = models.AutoField(primary_key=True)
    nombreEstudiante = models.CharField(max_length=50)
    documentoEstudiante = models.CharField(max_length=10)
    fechaMatricula = models.DateField()
    cursoMatricula = models.ForeignKey(Curso, on_delete=models.CASCADE)


class Instructor(models.Model):
    cedulaInstructor = models.CharField(max_length=10, primary_key=True)
    nombreInstructor = models.CharField(max_length=50)
    apellidoInstructor = models.CharField(max_length=50)
    titulacionInstructor = models.CharField(max_length=100)
    fotoInstructor = models.FileField(upload_to='media/instructor/', default='instructor/default.jpg')