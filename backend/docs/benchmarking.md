# Benchmarking

## Table of Contents <!-- omit in toc -->

- [Apache Benchmark](#apache-benchmark)

## Apache Benchmark

```bash
docker run --rm jordi/ab -n 100 -c 100 -T application/json -H "Authorization: Bearer USER_TOKEN" -v 2 http://<server_ip>:3000/api/v1/users
```

Adjust the endpoint and payload to cover the APIs you care about (e.g., `/api/v1/tasks`). Run the command against a built version of the service (`npm run start:prod`) to mimic production conditions.

---

Previous: [Tests](tests.md)

Next: [Automatic update of dependencies](automatic-update-dependencies.md)
