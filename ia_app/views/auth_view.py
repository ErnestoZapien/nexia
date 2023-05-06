from django.shortcuts import render
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required

def login_form_view(request):
    return render(request, 'auth/login_page.html')


@login_required()
def return_base_view(request):
    return render(request, 'base/base_page.html')

def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            current_path = request.path
            return redirect('/dashboard',{'current_path':current_path})
        else:
            messages.error(request, 'El correo y/o la contraseña son incorrectos',extra_tags="text-danger fw-bold")
            return redirect('/')
    else:
        return redirect('/')

@login_required()
def logout_view(request):
    logout(request)
    return redirect('/')
