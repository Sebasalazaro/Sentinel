# Submódulo EC2 Instances

Crea múltiples instancias EC2 con dos security groups:

- `trivy-instance`
- `backend`

Incluye reglas de ingress y egress específicas para cada grupo.

---

## Variables

- `instances` (list object): Lista de instancias (nombre y tipo).

### Ejemplo:

instances = [
{name = "A", instance_type = string},
{name = "B", instance_type = string}
]
