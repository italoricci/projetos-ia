SERVICE_TOKEN=$(
  curl -X POST http://localhost:9999/v1/auth/service-token \
  -H "Content-Type: application/json" \
  -d '{"username": "italo", "password": "1234", "adminSuperSecret": "super-secret-admin-token"}' \
  | jq -r '.serviceToken')

echo "AdminService Token: $SERVICE_TOKEN"


SERVICE_TOKEN=$(curl --silent -X POST http://localhost:9999/v1/auth/service-token \
  -H "Content-Type: application/json" \
  -d '{"username": "ananeri", "password": "1234", "adminSuperSecret": "super-secret-admin-token"}' \
  | jq -r '.serviceToken')

echo "Member Service Token: $SERVICE_TOKEN"

curl http://localhost:9999/v1/customers \
  -H "X-Service-Token: $SERVICE_TOKEN"