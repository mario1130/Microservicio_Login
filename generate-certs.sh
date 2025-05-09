#!/bin/bash

CERTS_DIR="./app/certs"

# Crear directorio para los certificados si no existe
mkdir -p $CERTS_DIR

# Generar CA
openssl genrsa -out $CERTS_DIR/ca.key 4096
openssl req -x509 -new -nodes -key $CERTS_DIR/ca.key -sha256 -days 365 -out $CERTS_DIR/ca.crt -subj "/CN=MiCA"

# Certificados para RabbitMQ (Servidor)
openssl genrsa -out $CERTS_DIR/server.key 2048
openssl req -new -key $CERTS_DIR/server.key -out $CERTS_DIR/server.csr -subj "/CN=rabbitmq-server"
openssl x509 -req -in $CERTS_DIR/server.csr -CA $CERTS_DIR/ca.crt -CAkey $CERTS_DIR/ca.key -CAcreateserial -out $CERTS_DIR/server.crt -days 365 -sha256

# Certificados para el cliente ms-login
openssl genrsa -out $CERTS_DIR/ms-login.key 2048
openssl req -new -key $CERTS_DIR/ms-login.key -out $CERTS_DIR/ms-login.csr -subj "/CN=ms-login"
openssl x509 -req -in $CERTS_DIR/ms-login.csr -CA $CERTS_DIR/ca.crt -CAkey $CERTS_DIR/ca.key -CAcreateserial -out $CERTS_DIR/ms-login.crt -days 365 -sha256

# Certificados para el cliente backend
openssl genrsa -out $CERTS_DIR/backend.key 2048
openssl req -new -key $CERTS_DIR/backend.key -out $CERTS_DIR/backend.csr -subj "/CN=backend"
openssl x509 -req -in $CERTS_DIR/backend.csr -CA $CERTS_DIR/ca.crt -CAkey $CERTS_DIR/ca.key -CAcreateserial -out $CERTS_DIR/backend.crt -days 365 -sha256

# Mensaje de éxito
echo "Certificados generados en $CERTS_DIR:"
ls -l $CERTS_DIR