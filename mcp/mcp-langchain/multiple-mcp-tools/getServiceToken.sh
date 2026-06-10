SERVICE_TOKEN=$(
  curl --silent -X POST http://localhost:9999/v1/auth/service-token \
  -H "Content-Type: application/json" \
  -d '{"username": "italo", "password": "1234", "adminSuperSecret": "super-secret-admin-token"}' \
  | jq -r '.serviceToken'
)

if grep -q "^SERVICE_TOKEN=" .env 2>/dev/null; then
  echo 'Gerando service token...'
  sed -i "s|^SERVICE_TOKEN=.*|SERVICE_TOKEN=$SERVICE_TOKEN|" .env
  echo 'Service token'
else
  echo "SERVICE_TOKEN=$SERVICE_TOKEN" >> .env
fi