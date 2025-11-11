# Translations

## Table of Contents <!-- omit in toc -->

- [How to add a new translation](#how-to-add-a-new-translation)
- [How to use translations on frontend](#how-to-use-translations-on-frontend)
- [How to use translations in code](#how-to-use-translations-in-code)

## How to add a new translation

1. Duplicate `src/i18n/en` and rename the folder to the desired ISO code.
2. Translate the JSON files (`common.json`, `confirm-email.json`, etc.).
3. Register the locale in the frontend if you want the UI to expose it.

## How to use translations on frontend

1. Send the `x-custom-lang` header with the language code (e.g., `ru`) on API requests.
2. The frontend already sets this header based on the active locale.

## How to use translations in code

```typescript
import { I18nContext } from 'nestjs-i18n';

// code ...

@Injectable()
export class SomeService {
  // code ...

  async someMethod(): Promise<void> {
    const i18n = I18nContext.current();

    if (!i18n) {
      throw new Error('I18nContext is not available');
    }

    const emailConfirmTitle = await i18n.t('common.confirmEmail');

    // code ...
  }
}
```

---

Previous: [Automatic update of dependencies](automatic-update-dependencies.md)
