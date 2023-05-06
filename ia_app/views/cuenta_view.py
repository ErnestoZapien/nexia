from django.shortcuts import render,redirect
from django.contrib.auth.decorators import login_required

@login_required()
def cuenta(request):
    return render(request, 'cuenta.html')