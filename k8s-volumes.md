# PVC and Ontology File Injection Guide

This guide explains how to set up a PersistentVolumeClaim (PVC) to provide secure access to your ontology file (`final_ifct_csv_json.owl`) without baking it into the Docker image. It also covers how to create an injector pod to upload the ontology file into the PVC.

---

## 1. Create Persistent Volume (PV) and Persistent Volume Claim (PVC)

Create a YAML file (e.g., `k8s/persistentVolume.yaml`) with the following content:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: ontology-pv
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadOnlyMany
  hostPath:
    path: "<Your HOST PATH>"
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: ontology-pvc
spec:
  accessModes:
    - ReadOnlyMany
  resources:
    requests:
      storage: 1Gi

```

> **Explanation**: This defines a claim for a volume of 1Gi that allows **read-only** access by multiple pods. We use a standard storage class provided by Minikube.

Apply it using:

```bash
kubectl apply -f k8s/persistentVolume.yaml
```

---

## 2. Deploy an Injector Pod to Mount the PVC

Create a file `k8s/pvc-injector.yaml` with the following content:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pvc-injector
spec:
  containers:
    - name: pvc-injector
      image: alpine
      command: ["sleep", "3600"]
      volumeMounts:
        - name: ontology-volume
          mountPath: /data
  volumes:
    - name: ontology-volume
      persistentVolumeClaim:
        claimName: ontology-pvc
  restartPolicy: Never
```

> **Explanation**: This creates a temporary Alpine container with the PVC mounted at `/data`. The pod sleeps for an hour, giving you time to copy the file.

Apply it:

```bash
kubectl apply -f k8s/pvc-injector.yaml
```

Wait for it to be running:

```bash
kubectl get pods
```

---

## 3. Copy the Ontology File into the PVC

Once the `pvc-injector` pod is running, copy your ontology file into it:

```bash
kubectl cp ./data/final_ifct_csv_json.owl pvc-injector:/data/final_ifct_csv_json.owl
```

> **Explanation**: `kubectl cp` uploads the ontology file from your local machine into the `/data` directory inside the running pod, which is backed by the PVC. This makes the file persist across pod restarts.

---

## 4. Clean Up the Injector Pod

After verifying the file is correctly copied (you can `kubectl exec -it pvc-injector -- sh` and run `ls /data`), you can delete the injector pod:

```bash
kubectl delete pod pvc-injector
```

> **Explanation**: This cleanup step removes the temporary injector pod. The data remains safe in the PVC.

---

## 5. Use the PVC in Backend Deployment

In your `backend-deployment.yaml`, mount the volume and pass the ontology path:

```yaml
spec:
  containers:
    - name: backend-container
      image: your-backend-image
      ports:
        - containerPort: 5001
      env:
        - name: ONTOLOGY_PATH
          value: /app/data/final_ifct_csv_json.owl
      volumeMounts:
        - name: ontology-volume
          mountPath: /app/data
          readOnly: true
  volumes:
    - name: ontology-volume
      persistentVolumeClaim:
        claimName: ontology-pvc
```

> **Explanation**: This mounts the same PVC to your backend container so it can read the file securely.

---
