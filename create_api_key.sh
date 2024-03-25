#!

curl 'http://localhost:8108/keys' \
    -X POST \
    -H "X-TYPESENSE-API-KEY: ${TYPESENSE_ADMIN_API_KEY}" \
    -H 'Content-Type: application/json' \
    -d '{"description":"Search-only all keys.","actions": ["documents:search"], "collections": ["*"]}'

