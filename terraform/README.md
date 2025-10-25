
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

"[nombre usuario iam]" sin comillas, si no se usa un usuario iam, poner default


aws_access_key_id = example


aws_secret_access_key = example



remplace los example con  credenciales validas de aws 


dentro de main.tf en el provider agregar:


un argumento profile = "[nombre usuario iam]" sin comillas, si no se usa un usuario iam, poner default



## Cómo probar

1. Ejecutar `terraform init`.
2. Ejecutar `terraform plan`.
3. Ejecutar `terraform apply`.
4. Verificar en AWS los recursos creados.
