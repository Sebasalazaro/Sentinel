
# Módulo raíz Terraform AWS

Este módulo orquesta tres submódulos para crear infraestructura en AWS:

- EC2: Varias instancias con dos security groups configurados.
- SQS: Cola SQS con política de envío de mensajes.
- S3: Bucket S3 con nombre configurable.

---

## Proveedor AWS

Este módulo requiere que el proveedor AWS esté configurado explícitamente en el módulo raíz, incluyendo:

- Región
- Perfil AWS o método válido de autenticación (archivo credentials, variables de entorno, rol IAM, etc.)

### Credenciales

Crear dentro del directorio root del modulo un directorio llamado .aws
adentro de este agregar esto: 

aws_access_key_id = example
aws_secret_access_key = example

remplace los example con  credenciales validas de aws 

- Variables de entorno: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`.
- Archivo de credenciales en la ruta predeterminada `~/.aws/credentials` con perfiles nombrados.
- Parámetros directos dentro del bloque `provider` (no recomendado por seguridad).
- Roles y perfiles de instancia IAM (usado en EC2).
- Otros métodos compatibles (como Vault, CLI configurado, etc.).

## Cómo probar

1. Configurar credenciales AWS válidas (archivo, env vars o roles).
2. Ejecutar `terraform init`.
3. Ejecutar `terraform plan`.
4. Ejecutar `terraform apply`.
5. Verificar en AWS los recursos creados.
