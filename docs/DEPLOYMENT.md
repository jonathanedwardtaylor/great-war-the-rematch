# Deployment

## Web Preview

The web version should eventually deploy to Vercel from the GitHub repository.

Expected future setup:

- Build command: `npm run build`
- Output folder: `dist`
- Production branch: `main`
- Preview deployments for pull requests or feature branches

## Mobile Packaging

Mobile packaging should wait until the web prototype is fun and stable.

Likely later path:

- Build HTML5 game.
- Package with Capacitor.
- Test on iOS and Android devices.
- Use App Store Connect and Google Play Console for distribution.

## Payments

- Web version can use web payment providers if needed.
- App store versions should assume Apple In-App Purchase and Google Play Billing for digital unlocks or in-game purchases.
