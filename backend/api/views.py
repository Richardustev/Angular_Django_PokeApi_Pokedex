# Importaciones necesarias de Django Rest Framework y Django
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

@api_view(['POST'])
def login_view(request):
    # Extraer los datos de usuario y contraseña de la solicitud.
    username = request.data.get('username')
    password = request.data.get('password')

    # Verificar si el nombre de usuario y la contraseña fueron proporcionados.
    if not username or not password:
        return Response(
            {'error': 'Se requiere nombre de usuario y contraseña.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Autenticar al usuario
    user = authenticate(username=username, password=password)

    # Comprobar si la autenticación fue exitosa.
    if user is not None:
        # CORRECT: Use Token.objects from rest_framework.authtoken.models
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'message': 'Inicio de sesión exitoso.',
            'token': token.key
        }, status=status.HTTP_200_OK)
    else:
        # Si la autenticación falla, se devuelve un error de credenciales no válidas.
        return Response(
            {'error': 'Credenciales no válidas.'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
@api_view(['POST'])
def register_view(request):
    # Extraer los datos de la solicitud.
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email') # Opcional, pero recomendado.

    # 1. Validar la entrada
    if not username or not password or not email:
        return Response(
            {'error': 'Se requiere nombre de usuario, contraseña y correo electrónico.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # 2. Comprobar si el usuario ya existe
    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'El nombre de usuario ya está en uso.'},
            status=status.HTTP_409_CONFLICT
        )
    
    if User.objects.filter(email=email).exists():
        return Response(
            {'error': 'El correo electrónico ya está registrado.'},
            status=status.HTTP_409_CONFLICT
        )

    # 3. Crear el nuevo usuario
    try:
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email
        )
        
        # 4. Generar y devolver un token de autenticación
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'message': 'Usuario registrado exitosamente.',
            'token': token.key
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )