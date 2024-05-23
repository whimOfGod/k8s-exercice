docker rmi aaronkolins77/worker
docker rmi aaronkolins77/planner

cd worker/
kubectl delete -f worker-pod.yaml
kubectl delete -f deployment.yaml
kubectl delete -f worker-add-deployment.yaml
kubectl delete -f worker-mult-deployment.yaml
kubectl delete -f worker-service.yaml

cd ..
cd planner/
kubectl delete -f planner-pod.yaml
kubectl delete -f planner-service.yaml