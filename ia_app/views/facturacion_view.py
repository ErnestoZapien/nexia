from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

@login_required()
def facturacion(request):
    return render(request, 'facturacion.html')
   
