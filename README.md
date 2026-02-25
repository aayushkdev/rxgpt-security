## Task 1 – Python CLI Scanner

### Run

```bash
python rxgpt-scan.py rxgpthealth:mvp
```
### Screenshot – Vulnerability Scan

![Scan Output](assets/cli-scan.png)

### Task 2 - React Dashboard
### Run

```bash
cd frontend
npm run dev
```
### Screenshot – Login Screen

![Scan Output](assets/login1.png)
![Scan Output](assets/login2.png)
![Scan Output](assets/login3.png)
![Scan Output](assets/login4.png)

### Screenshot – Dashboard

![Scan Output](assets/dashboard.png)

### Task 3 - K8s Deployment

```bahsh
kubectl apply -f k8s-job.yaml
kubectl get jobs
kubectl logs job/rxgpt-security-scan
```