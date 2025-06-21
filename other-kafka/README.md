# Other-Kafka

A Kafka runtime, deployed into a k8s cluster, for generic use by other Trivia Together services. Its something of an evolving event backbone for the overall solution.

## Important considerations

* Perhaps Persistent Volumes
* Available within and externally to the cluster (externally, especially during 'development').
* Explore sharding.
* Use Strimzi, in part to employ KRaft vs. ZooKeeper, and other simplicities. This will likely use Bitnami's Helm Chart for Kafka. The use of Helm will also likely lead to more Helm usage by Trivia Together overall.
* New idea: start with [this Strimzi quick start](https://strimzi.io/quickstarts/).

## Example Use Cases

**Event-Driven Microservices:** Kafka is commonly used to enable communication and coordination between microservices through event streams.
**Real-time Data Processing:** Kafka can be used as a source for stream processing pipelines that analyze and transform data in real-time.

## Other

* Capture commands into this README and/or `./scripts`.

## Some Scripts

```sh
kubectl create namespace kafka
kubectl create -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka
kubectl get pod -n kafka --watch
kubectl logs deployment/strimzi-cluster-operator -n kafka -f
kubectl apply -f https://strimzi.io/examples/latest/kafka/kafka-single-node.yaml -n kafka 
kubectl wait kafka/my-cluster --for=condition=Ready --timeout=300s -n kafka 

kubectl -n kafka run kafka-producer -ti --image=quay.io/strimzi/kafka:0.46.0-kafka-4.0.0 --rm=true --restart=Never -- bin/kafka-console-producer.sh --bootstrap-server my-cluster-kafka-bootstrap:9092 --topic my-topic
kubectl -n kafka run kafka-consumer -ti --image=quay.io/strimzi/kafka:0.46.0-kafka-4.0.0 --rm=true --restart=Never -- bin/kafka-console-consumer.sh --bootstrap-server my-cluster-kafka-bootstrap:9092 --topic my-topic --from-beginning

kubectl -n kafka delete $(kubectl get strimzi -o name -n kafka)
kubectl delete pvc -l strimzi.io/name=my-cluster-kafka -n kafka
kubectl -n kafka delete -f 'https://strimzi.io/install/latest?namespace=kafka'
kubectl delete namespace kafka

```
