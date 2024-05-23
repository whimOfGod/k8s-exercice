cd planner/
docker build -t aaronkolins77/planner .
docker push aaronkolins77/planner

kubectl apply -f planner-deployment.yaml
kubectl apply -f planner-service.yaml

cd ../worker/
docker build -t aaronkolins77/worker .
docker push aaronkolins77/worker

kubectl apply -f worker-add-deployment.yaml
kubectl apply -f worker-mult-deployment.yaml
kubectl apply -f worker-service.yaml
