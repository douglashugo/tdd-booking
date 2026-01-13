# TDD Booking

Projeto de exemplo para reservas (booking) com TypeScript, testes com Jest e foco em TDD.

## Requisitos

- Node.js e npm instalados

## Como executar

1) Instale as dependencias:

```bash
npm install
```

2) Execute os testes:

```bash
npm test
```

## Estrutura basica

- `src/domain`: entidades, value objects e regras de negocio
- `src/application`: servicos e DTOs
- `src/infrastructure`: persistencia, repositorios e controllers

## Observacoes

- Nao ha um servidor ou CLI configurado por padrao; os testes exercitam a aplicacao.
