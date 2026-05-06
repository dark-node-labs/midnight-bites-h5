# Bitesize Arcade

Bitesize Arcade is a static mini-game website. The home page introduces the arcade brand, while Midnight Bites lives on its own optimized game page as a free online restaurant game.

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

1. Create or open the GitHub repository for the site.
2. Initialize and push from this folder:

```bash
git init
git add .
git commit -m "Initial H5 release"
git branch -M main
git remote add origin git@github.com:YOUR_NAME/YOUR_REPO.git
git push -u origin main
```

3. Open `Settings > Pages` in the GitHub repository.
4. Set Source to `Deploy from a branch`.
5. Set Branch to `main` and Folder to `/root`.
6. Save and wait for GitHub Pages to build.

Production URL:

```text
https://bitesizearcade.com/
```

The repository includes `CNAME`, `robots.txt`, and `sitemap.xml` configured for the custom domain.

## Launch Checklist

- The home page presents Bitesize Arcade as the main site brand.
- `/midnight-bites/` presents Midnight Bites as the optimized game page.
- `/restaurant-games/`, `/food-games/`, and `/time-management-games/` provide category landing pages.
- `index.html`, `styles.css`, and `game.js` use relative asset paths.
- The mobile first screen shows the start button without requiring a scroll.
- Food cards are large enough on 375px, 390px, and 414px mobile widths.
- The loading screen, healthy-play notice, and age notice appear before the first run.
- Audio starts only after a user gesture.
- `assets/social/share-cover.jpg` is reachable as the social share image.
- Privacy Policy and Terms pages are linked from the menu.
- `og:image`, `twitter:image`, `canonical`, `robots.txt`, and `sitemap.xml` use `https://bitesizearcade.com/`.
- Add `https://bitesizearcade.com/` to Google Search Console after deployment.

## Project Structure

```text
assets/icons/        PWA and browser icons
assets/social/       Social sharing image
docs/                Privacy Policy and Terms
food-games/          Food games category page
midnight-bites/      Midnight Bites playable game page
restaurant-games/    Restaurant games category page
time-management-games/ Time management games category page
index.html           Bitesize Arcade home page
styles.css           Page layout and mobile adaptation
game.js              Canvas game logic
manifest.webmanifest PWA configuration
robots.txt           Search crawler configuration
CNAME                GitHub Pages custom domain
sitemap.xml          XML sitemap
```
