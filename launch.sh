cd worker/
docker build -t aaronkolins77/worker .
docker push aaronkolins77/worker
kubectl apply -f worker-pod.yaml
kubectl apply -f deployment.yaml
kubectl apply -f worker-service.yaml
cd ..
cd planner/
docker build -t aaronkolins77/planner .
docker push aaronkolins77/planner
kubectl apply -f planner-pod.yaml
kubectl apply -f planner-service.yaml