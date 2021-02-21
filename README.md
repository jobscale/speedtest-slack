## speed test of container

## getting start
```bash
git clone https://github.com/jobscale/speed-test.git
cd speed-test
```

## local test
```bash
npm i
npm run lint
npm start
```

## container build and run
```bash
docker build . -t local/speed-test
docker run --rm -e NODE_ENV=LOCAL -it local/speed-test
```

### create cronjob
```bash
kind load docker-image local/speed-test --name production
kubectl create cronjob speed-test --image local/speed-test --schedule '0/7 * * * *'
```

### create one time job
```bash
kubectl create job --from=cronjob/speed-test speed-test-manual-$(date +'%Y%m%d-%H%M%S')
```
