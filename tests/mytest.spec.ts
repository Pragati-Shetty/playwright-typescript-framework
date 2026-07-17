import {test,expect} from '@playwright/test';
test ('basic test',async({page})=>{
await page.goto('https://automationexercise.com/login');
await expect(page).toHaveTitle(/Automation Exercise/);
})