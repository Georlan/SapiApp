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
- Expo SDK 57
- TypeScript
- Expo Router
- AsyncStorage para estado local do MVP
- Supabase será integrado quando o loop principal estiver validado

## Rodar

Requer Node.js 22.13+ para Expo SDK 57.

```bash
npm install
npx expo start
```

Abra no Android usando um development build compatível com SDK 57. Se preferir testar com a versão pública atual do Expo Go e ela ainda não suportar SDK 57, use um development build/EAS ou ajuste temporariamente para um SDK compatível.
