from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from .managers import UserManager


class User(AbstractBaseUser):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = UserManager()

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True


class Empresa(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    direccion = models.CharField(max_length=255)
    telefono = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    estatus = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre


class Tema(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre


class Bot(models.Model):
    id = models.AutoField(primary_key=True)
    imagen = models.URLField()
    nombre = models.CharField(max_length=100)
    tema = models.ForeignKey(Tema, on_delete=models.CASCADE)
    status = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre


class Mensajes(models.Model):
    id = models.AutoField(primary_key=True)
    mensaje = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)
    bot = models.ForeignKey(Bot, on_delete=models.CASCADE)
    options = (
        ('1', 'question'),
        ('2', 'aswer'),
    )
    type = models.CharField(max_length=1, choices=options, default='1')

    def __str__(self):
        return self.nombre


class Skill(models.Model):
    id = models.AutoField(primary_key=True)
    bans = models.TextField()  # palabras prohibidas y/o acciones
    answer_unkwn = models.TextField()  # respuesta si no se encuentra la respuesta
    skill = models.TextField()  # habilidades del bot
    language = models.TextField()  # lenguaje del bot
    bot = models.ForeignKey(Bot, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.skill


class Detalles(models.Model):
    id = models.AutoField(primary_key=True)
    question = models.TextField()
    answer = models.TextField()
    bot = models.ForeignKey(Bot, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.question


class Boton(models.Model):
    id = models.AutoField(primary_key=True)
    position = models.BooleanField()
    colorBot = models.TextField()
    colorUsr = models.TextField()
    background = models.BooleanField()
    colorPrimary = models.TextField()
    colorSecondary = models.TextField()
    typeColor = models.BooleanField()
    bot = models.ForeignKey(Bot, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.colorPrimary
