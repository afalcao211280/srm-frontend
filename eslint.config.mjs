{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "paths": [
          {
            "name": "node:fetch",
            "message": "use a camada @/lib/api para acessar a API"
          }
        ]
      }
    ]
  }
}
