# Sapi

Aplicativo Android de aprendizagem gamificada para ENEM e fundamentos escolares.

## MVP 0.1

O primeiro corte valida o loop principal do produto:

- onboarding curto e personalizado;
- trilha de Matemática;
- 3 lições jogáveis;
- XP, corações e sequência;
- progresso persistido localmente;
- checkpoint da primeira unidade.

## Stack

- React Native
- Expo SDK 54
- TypeScript
- Expo Router
- AsyncStorage para estado local do MVP
- Supabase será integrado quando o loop principal estiver validado

## Rodar no Android

A escolha do SDK 54 é intencional neste primeiro estágio para facilitar os testes rápidos com a versão pública atual do Expo Go.

```bash
npm install
npx expo start
```

No Android, abra o Expo Go e escaneie o QR Code exibido pelo Expo.

Se o celular e o computador não se enxergarem na rede local, tente:

```bash
npx expo start --tunnel
```

## Próximas etapas

1. validar visual e sensação do onboarding;
2. validar o loop de lição e progressão;
3. adicionar revisão e modo simulado;
4. integrar Supabase/Auth;
5. preparar monetização e plano Pro.
