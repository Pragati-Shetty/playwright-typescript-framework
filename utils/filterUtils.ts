import { Page, Locator, expect } from "@playwright/test";

export class FilterUtils {
  private spanLocator: Locator;

  constructor(private page: Page) {
    // Initialize spanLocator here, after page is assigned
    this.spanLocator = this.page.locator("span");
  }

  private async clickByText(locator: Locator, text: string) {
    await locator.filter({ hasText: text }).first().click();
  }

  async applyGenericFilters(
    filterConfigs: {
      value?: string;
      before?: () => Promise<void>;
      action?: () => Promise<void>;
      locator?: string;
      label?: string;
      type?: "contains" | "equal" | "price" | "duration";
    }[]
  ) {
    for (const filter of filterConfigs) {
      if (!filter.value) continue;

      if (filter.before) await filter.before();

      if (filter.action) {
        await filter.action();
      } else {
        if (filter.locator) {
          await this.clickByText(this.page.locator(filter.locator), filter.value);
        } else {
          await this.clickByText(this.spanLocator, filter.value);
        }
      }

      if (filter.label && filter.type) {
        const locator = filter.locator ? this.page.locator(filter.locator) : this.spanLocator;
        // Call verifyLoop if needed:
        // await this.verifyLoop(locator, filter.value, filter.label, filter.type);
      }
    }
  }
}