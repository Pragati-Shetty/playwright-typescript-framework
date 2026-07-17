import{test,expect, Locator} from "@playwright/test";
test("Multi select dropdown", async({page})=>{
await page.goto("https://testautomationpractice.blogspot.com/");
const dropdownoptions:Locator=page.locator("#animals option");
console.log(dropdownoptions)

})