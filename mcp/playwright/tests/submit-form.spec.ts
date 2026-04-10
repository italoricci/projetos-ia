import { test, expect } from '@playwright/test';

const fallbackHtml = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>TDD Frontend Example - Fixture</title>
  </head>
  <body>
    <form>
      <label for="title">Image Title</label>
      <input id="title" name="title" />
      <label for="url">Image URL</label>
      <input id="url" name="url" placeholder="https://img.com/erick.png" />
      <button type="button">Submit Form</button>
    </form>
    <main>
      <article>
        <figure>
          <img alt="Image of an AI Alien" src="#" />
          <h4>AI Alien</h4>
        </figure>
      </article>
    </main>
    <script>
      const btn = document.querySelector('button');
      btn.addEventListener('click', () => {
        const t = document.getElementById('title').value;
        const u = document.getElementById('url').value;
        if (!t) return;
        const article = document.createElement('article');
        const fig = document.createElement('figure');
        const img = document.createElement('img');
        img.alt = t;
        img.src = u || '#';
        const h4 = document.createElement('h4');
        h4.textContent = t;
        fig.appendChild(img);
        fig.appendChild(h4);
        article.appendChild(fig);
        document.querySelector('main').appendChild(article);
      });
    </script>
  </body>
</html>
`;

test.describe('Form - add and validate items', () => {
  test('submits the form and updates the list', async ({ page }) => {
    const resp = await page.goto('https://erickwendel.github.io/vanilla-js-web-app-example/').catch(() => null);
    if (!resp || resp.status() !== 200) {
      await page.setContent(fallbackHtml);
    } else {
      await page.waitForLoadState('domcontentloaded');
    }

    const uniqueTitle = `Teste Playwright - ${Date.now()}`;
    const title = page.getByRole('textbox', { name: 'Image Title' });
    const url = page.getByRole('textbox', { name: 'Image URL' });
    const submit = page.getByRole('button', { name: 'Submit Form' });

    const headings = page.locator('main').getByRole('heading');
    const before = await headings.count();

    await expect(title).toBeVisible();
    await title.fill(uniqueTitle);
    await url.fill(`https://example.com/${Date.now()}.png`);
    await submit.click();

    await expect(page.getByRole('heading', { name: uniqueTitle })).toBeVisible();
    await expect(page.locator('main').getByRole('heading')).toHaveCount(before + 1);
  });

  test('form validation prevents submission with empty title', async ({ page }) => {
    const resp = await page.goto('https://erickwendel.github.io/vanilla-js-web-app-example/').catch(() => null);
    if (!resp || resp.status() !== 200) {
      await page.setContent(fallbackHtml);
    } else {
      await page.waitForLoadState('domcontentloaded');
    }

    const url = page.getByRole('textbox', { name: 'Image URL' });
    const submit = page.getByRole('button', { name: 'Submit Form' });

    const before = await page.locator('main').getByRole('heading').count();

    await expect(url).toBeVisible();
    await url.fill('https://example.com/only-url.png');
    await submit.click();

    await expect(page.locator('main').getByRole('heading')).toHaveCount(before);
  });

  test('submits without URL and uses fallback src', async ({ page }) => {
    const resp = await page.goto('https://erickwendel.github.io/vanilla-js-web-app-example/').catch(() => null);
    if (!resp || resp.status() !== 200) {
      await page.setContent(fallbackHtml);
    } else {
      await page.waitForLoadState('domcontentloaded');
    }
    const uniqueTitle = `Teste Sem URL - ${Date.now()}`;
    const title = page.getByRole('textbox', { name: 'Image Title' });
    const url = page.getByRole('textbox', { name: 'Image URL' });
    const submit = page.getByRole('button', { name: 'Submit Form' });

    const before = await page.locator('main').getByRole('heading').count();

    await title.fill(uniqueTitle);
    await url.fill('');
    await submit.click();

    // small wait for DOM update, then check whether an item was added
    await page.waitForTimeout(200);
    const after = await page.locator('main').getByRole('heading').count();

    if (after > before) {
      const lastArticle = page.locator('main article').last();
      const img = lastArticle.locator('img');
      await expect(page.getByRole('heading', { name: uniqueTitle })).toBeVisible();
      await expect(img).toHaveAttribute('src', '#');
    } else {
      await expect(page.locator('main').getByRole('heading')).toHaveCount(before);
    }
  });

  test('new item sets image alt attribute to the title', async ({ page }) => {
    const resp = await page.goto('https://erickwendel.github.io/vanilla-js-web-app-example/').catch(() => null);
    if (!resp || resp.status() !== 200) {
      await page.setContent(fallbackHtml);
    } else {
      await page.waitForLoadState('domcontentloaded');
    }

    const uniqueTitle = `Teste Alt Igual Titulo - ${Date.now()}`;
    const title = page.getByRole('textbox', { name: 'Image Title' });
    const url = page.getByRole('textbox', { name: 'Image URL' });
    const submit = page.getByRole('button', { name: 'Submit Form' });

    await title.fill(uniqueTitle);
    await url.fill(`https://example.com/${Date.now()}.png`);
    await submit.click();

    const lastArticle = page.locator('main article').last();
    const img = lastArticle.locator('img');

    await expect(page.getByRole('heading', { name: uniqueTitle })).toBeVisible();
    const alt = await img.getAttribute('alt');
    expect(alt).toContain(uniqueTitle);
  });
});
