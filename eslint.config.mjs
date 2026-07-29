import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "node:fetch",
              message: "use a camada @/lib/api para acessar a API",
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
