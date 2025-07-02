# Usa una imagen oficial de Python.
FROM python:3.11-slim

# Evita que Python escriba archivos .pyc
ENV PYTHONDONTWRITEBYTECODE 1
# Asegura que la salida de Python no se almacene en búfer
ENV PYTHONUNBUFFERED 1

# Establece el directorio de trabajo en /app
WORKDIR /app

# Instala las dependencias
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código de la aplicación
COPY . /app/

# Expone el puerto 8000 para que Django pueda ser accesible
EXPOSE 8000

# El comando para correr la aplicación será manejado por docker-compose o un script de entrada.
# Por ejemplo: CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"] 