# Proyecto: **Earnest Porpoise – Plataforma de Escaneo Automático de Vulnerabilidades**

## 1. Estrategia

### 1.1 Planteamiento del Problema

Las empresas de desarrollo de software enfrentan crecientes dificultades para mantener prácticas de codificación seguras.  
La falta de formación en ciberseguridad por parte de los desarrolladores y la ausencia de pruebas automatizadas de seguridad en el ciclo de desarrollo generan riesgos de vulnerabilidades críticas (inyección SQL, XSS, exposición de secretos, entre otros).

En la práctica, muchas organizaciones omiten las pruebas de seguridad por limitaciones de tiempo, recursos o desconocimiento técnico, aumentando la probabilidad de incidentes costosos y compromisos de datos.  
Además, la detección manual de vulnerabilidades resulta ineficiente y propensa a errores humanos.

---

### 1.2 Propósito del Proyecto

El propósito de este proyecto es diseñar e implementar una plataforma SaaS (Software as a Service) que permita ejecutar análisis automatizados de seguridad sobre los repositorios de código de los equipos de desarrollo (GitHub, GitLab, Bitbucket), integrándose sin fricción en su flujo de trabajo.

La solución sigue un enfoque DevSecOps, en el que la seguridad se integra de forma continua en el pipeline de desarrollo, sin afectar la velocidad ni productividad de los equipos.  
Se busca que el sistema detecte vulnerabilidades comunes, priorice las de mayor impacto y genere reportes en tiempo real con recomendaciones de mitigación.

---

## 2. Descripción General del Sistema

### 2.1 Nombre del Sistema
**Earnest Porpoise** – Plataforma de Escaneo de Vulnerabilidades Automatizada.

### 2.2 Objetivo General
Construir una infraestructura desplegable en AWS (EC2) que permita ejecutar herramientas de escaneo como **Trivy** (para análisis de dependencias y CVEs) y **OWASP ZAP** (para análisis dinámico de aplicaciones), activadas automáticamente mediante **webhooks de GitHub**.

---

## 3. Arquitectura de la Solución

### 3.1 Diagrama de Arquitectura


<img width="1100" height="518" alt="image" src="https://github.com/user-attachments/assets/8ff26937-88d1-4651-925d-7ea8eaad97f4" />


### 3.2 Descripción de Componentes

| Componente | Descripción |
|-------------|-------------|
| GitHub Repository| Contiene el código fuente del cliente. Configurado con un **webhook** que envía eventos HTTP a la API del sistema cada vez que ocurre un `push` o `pull request`. |
| Webhook API  | Endpoint expuesto en la instancia EC2 que recibe las notificaciones y dispara los análisis de seguridad. Implementado en Python (Flask o FastAPI). |
| Trivy | Escáner de vulnerabilidades que analiza dependencias, contenedores e infraestructura como código (IaC). Detecta CVEs conocidos y versiones obsoletas. |
| OWASP ZAP | Proxy de análisis dinámico que identifica vulnerabilidades activas (XSS, inyección, headers faltantes, etc.) mediante pruebas automatizadas sobre la aplicación. |
| AWS EC2 | Entorno de ejecución donde se aloja la API, los escáneres y el orquestador de tareas. Puede desplegarse mediante **Docker Compose** o **Terraform**. |
| Canal de Reporte | Resultados exportados como JSON y enviados a Slack, correo o un dashboard (Grafana/ELK) para priorización. | #ESTO CREO QUE TOCA CAMBIARLO
| Almacenamiento en DynamoDB | Aqui se almacenaran los resultados del escaneo, nombre del repo y metadata. |

---

## 4. Flujo de Operación

1. El desarrollador realiza un **push o pull request** en el repositorio de GitHub.
2. GitHub envía un **webhook** a la API alojada en la instancia EC2.
3. La API clona el repositorio y lanza los siguientes procesos:
   - **Trivy** → Análisis de dependencias, librerías y archivos IaC.
   - **ZAP** → Escaneo dinámico de endpoints HTTP (si aplica).
4. Los resultados se consolidan en un reporte estructurado (JSON o HTML).
5. El sistema envía los hallazgos por correo, Slack o dashboard interno.
6. Se registran las vulnerabilidades para auditoría continua.

---

## 5. Stack Tecnológico

| Categoría | Herramienta / Servicio |
|------------|-------------------------|
| Infraestructura | AWS EC2, Docker, Terraform |
| Seguridad (SCA) | Trivy |
| Seguridad (DAST) | OWASP ZAP |
| Backend | Python (FastAPI / Flask) |
| Automatización | GitHub Webhooks |
| Reportes / Alertas | JSON / Slack Webhooks / Grafana |
| Control de Acceso | IAM Roles en AWS, API Keys privadas |

---

## 6. Beneficios del Sistema

- **Automatización completa** de escaneos de seguridad tras cada cambio en el código.
- **Detección temprana** de vulnerabilidades críticas (CVEs, configuraciones inseguras, XSS, SQLi, etc.).
- **Reducción del riesgo** de exposición de datos y fallos en producción.
- **Integración sin fricción** con repositorios existentes (GitHub, GitLab, Bitbucket).
- **Escalabilidad** mediante despliegues en contenedores o Kubernetes.

---

## 7. Plan de Despliegue

| Fase | Actividad | Herramientas |
|------|------------|--------------|
| **1. Infraestructura Base** | Crear instancia EC2, configurar Docker y permisos IAM. | AWS EC2, Terraform |
| **2. API del Escáner** | Desarrollar endpoint Flask/FastAPI para recibir webhooks. | Python |
| **3. Integración de Trivy y ZAP** | Contenerizar ambas herramientas y definir scripts de análisis. | Docker Compose |
| **4. Configuración Webhook GitHub** | Conectar repositorios clientes con la API. | GitHub Webhooks |
| **5. Reportes y Dashboard** | Implementar salida JSON + alertas Slack. | Slack API / Grafana |
| **6. Pruebas y Validación** | Ejecutar escaneos de prueba sobre DVWA o Juice Shop. | OWASP Juice Shop |

---

## 8. Métricas de Éxito

- Tiempo promedio por escaneo (objetivo: < 3 min).
- Número de vulnerabilidades detectadas por build.
- Falsos positivos < 10%.
- Integración CI/CD en repositorios externos sin fallos.
- Reporte consolidado y accesible al usuario final.

---

## 9. Próximos Pasos

- Extender soporte para **GitLab y Bitbucket**.
- Añadir **autenticación de usuarios** y panel de control.
- Incorporar **machine learning** para priorizar vulnerabilidades según severidad histórica.
- Desplegar versiones contenedorizadas con **Kubernetes** y **Helm**.

---

## 10. Conclusión

**Earnest Porpoise** proporciona una infraestructura segura, automatizada y escalable para incorporar la seguridad en el ciclo de vida del desarrollo de software.  
Al integrarse directamente con los repositorios y automatizar los escaneos de vulnerabilidades, la plataforma permite reducir riesgos sin ralentizar el desarrollo, fomentando una cultura DevSecOps práctica y sostenible.
