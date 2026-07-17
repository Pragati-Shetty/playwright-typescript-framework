/*
Locators- Identifies the elements in the page
DOM- Document object model

page.getByRole() to locate by explicit and implicit accessibility attributes.
page.getByText() to locate by text content.
page.getByLabel() to locate a form control by associated label's text.
page.getByPlaceholder() to locate an input by placeholder.
page.getByAltText() to locate an element, usually image, by its text alternative.
page.getByTitle() to locate an element by its title attribute.
page.getByTestId() to locate an element based on its data-testid attribute (other attributes can be configured).
*/


/*import {test,expect, Locator} from '@playwright/test';
test("Verify playwright locators", async({page})=>{

await page.goto("https://demo.nopcommerce.com/");
const logo:Locator=page.getByAltText("nopCommerce demo store");
await expect(logo).toBeVisible();
await expect(page.getByText("Welcome to our store")).toBeVisible();
})
*/

//getByRole
import {test,expect} from "@playwright/test";
test ("Verify the Register feature", async({page})=>{
    await page.goto("https://demo.nopcommerce.com/");
/*
    await page.getByRole("link",{name:'Register'}).click();
await expect(page.getByRole("heading",{name:'Register'})).toBeVisible();
//getByLabel
await page.getByLabel('First name:').fill("John");
await page.getByLabel('Last name:').fill("Kenedy");
await page.getByLabel('Email:').fill("abc@gmail.com");
//getByPlaceholder
await page.getByPlaceholder('Search store').fill("Apple MacBook Pro");
*/
//getByTitle
await expect(page.getByRole('link',{name: "Categories"})).toBeVisible();
//await page.getByRole('link', { name: 'Computers' }).click();
})