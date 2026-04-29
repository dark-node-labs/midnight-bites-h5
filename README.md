# Midnight Bites H5

Midnight Bites is a mobile-first H5 game about street-food orders, global city flavors, and combo scoring. Players choose a city, tap snacks in the displayed order, and try to clear the full rush with a higher combo.

## Local Preview

```bash
python3 -m http.server 5173
```

Open:

```text
http://127.0.0.1:5173
```

For real-device mobile testing, keep the phone and computer on the same Wi-Fi and open the computer LAN address, for example:

```text
http://192.168.31.216:5173
```

## GitHub Pages Deployment

1. Create a GitHub repository, for example `midnight-bites-h5`.
2. Initialize and push from this folder:

```bash
git init
git add .
git commit -m "Initial H5 release"
git branch -M main
git remote add origin git@github.com:YOUR_NAME/midnight-bites-h5.git
git push -u origin main
```

3. Open `Settings > Pages` in the GitHub repository.
4. Set Source to `Deploy from a branch`.
5. Set Branch to `main` and Folder to `/root`.
6. Save and wait for GitHub Pages to build.

Default public URL:

```text
https://YOUR_NAME.github.io/midnight-bites-h5/
```

After the first Pages deployment succeeds, replace the social and SEO URLs with the final public URL:

- Add a canonical URL to `index.html`.
- Change `og:image` and `twitter:image` to absolute HTTPS URLs.
- Add a `sitemap.xml` with absolute URLs.
- Add `Sitemap: https://YOUR_NAME.github.io/midnight-bites-h5/sitemap.xml` to `robots.txt`.

## Launch Checklist

- `index.html`, `styles.css`, and `game.js` use relative asset paths.
- The mobile first screen shows the start button without requiring a scroll.
- Food cards are large enough on 375px, 390px, and 414px mobile widths.
- The loading screen, healthy-play notice, and age notice appear before the first run.
- Audio starts only after a user gesture.
- `assets/social/share-cover.jpg` is reachable as the social share image.
- Privacy Policy and Terms pages are linked from the menu.
- After GitHub Pages is live, `og:image`, `twitter:image`, `canonical`, `robots.txt`, and `sitemap.xml` use the final public URL.
- Add the final public URL to Google Search Console after deployment.

## Project Structure

```text
assets/icons/        PWA and browser icons
assets/social/       Social sharing image
docs/                Privacy Policy and Terms
index.html           H5 entry
styles.css           Page layout and mobile adaptation
game.js              Canvas game logic
manifest.webmanifest PWA configuration
robots.txt           Search crawler configuration
.nojekyll            GitHub Pages static publishing marker
```
