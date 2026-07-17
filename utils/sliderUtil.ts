import { Page, Locator, expect } from "@playwright/test";

export async function dragSliderToValue(
  page: Page,
  config: any,
  convertTimeToMinutes: (time: string) => number,
  convertDurationToMinutes: (duration: string) => number
) {
  const slider = page.locator('div.thumb.thumb-1[role="slider"]').nth(config.index);

  const UIvalueLocator =
    config.nth !== undefined
      ? page.locator(config.locator).nth(config.nth)
      : page.locator(config.locator);

  await slider.scrollIntoViewIfNeeded();
  const box = await slider.boundingBox();
  if (!box) return;

  let startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();

  const targetValue =
    typeof config.value === "number"
      ? config.value
      : config.type === "time"
      ? convertTimeToMinutes(config.value)
      : convertDurationToMinutes(config.value);

  for (let i = 0; i < 60; i++) {
    startX -= config.step;

    await page.mouse.move(startX, startY, { steps: 5 });
    await page.waitForTimeout(50);

    const currentText = await UIvalueLocator.textContent();
    if (!currentText) continue;

    const currentValue =
      config.type === "price"
        ? Number(currentText.replace(/[^\d]/g, "")) || 0
        : config.type === "time"
        ? convertTimeToMinutes(currentText)
        : convertDurationToMinutes(currentText);

    if (currentValue <= targetValue) break;
  }

  await page.mouse.up();

  const finalText = await UIvalueLocator.textContent();

  console.log("--------------------------------------------------");
  console.log(`Slider Name : ${config.name}`);
  console.log(`Expected Value (JSON) : ${config.value}`);
  console.log(`Actual UI Value : ${finalText}`);
  console.log("--------------------------------------------------");

  return finalText; // ✅ important for validations in both classes
}