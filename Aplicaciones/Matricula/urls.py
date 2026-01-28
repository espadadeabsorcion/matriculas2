from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('nuevo_curso/', views.nuevo_curso, name='nuevo_curso'),
    path('editar_curso/<int:codigoCurso>/', views.editar_curso, name='editar_curso'),
    path('eliminar_curso/<int:codigoCurso>/', views.eliminar_curso, name='eliminar_curso'),
    path('lista_matriculas/', views.lista_matriculas, name='lista_matriculas'),
    path('editar_matricula/<int:matricula_id>/', views.editar_matricula, name='editar_matricula'),
    path('eliminar_matricula/<int:matricula_id>/', views.eliminar_matricula, name='eliminar_matricula'),
    path('nueva_matricula/', views.nueva_matricula, name='nueva_matricula'),
    path('reporte/', views.reporte_matriculas, name='reporte_matriculas'),
    path('lista_instructores/', views.lista_instructores, name='lista_instructores'),
    path('nuevo_instructor/', views.nuevo_instructor, name='nuevo_instructor'),
    path('editar_instructor/<str:cedulaInstructor>/', views.editar_instructor, name='editar_instructor'),
    path('eliminar_instructor/<str:cedulaInstructor>/', views.eliminar_instructor, name='eliminar_instructor'),
]