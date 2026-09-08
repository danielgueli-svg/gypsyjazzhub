#!/bin/sh
set -eu
cd /workspace

ready() {
  code=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 3 http://127.0.0.1:8080/ || echo 000)
  [ "$code" = "200" ]
}

if ready; then
  exit 0
fi

npm run dev >>/tmp/app-startup.log 2>&1 &

i=0
while [ "$i" -lt 40 ]; do
  if ready; then
    exit 0
  fi
  i=$((i + 1))
  sleep 1
done

exit 0
