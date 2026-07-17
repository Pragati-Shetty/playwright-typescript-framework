import {test,expect, Locator, selectors} from "@playwright/test"
test("Checkbox and radiobutton practice", async({page})=>{
    await page.goto("https://testautomationpractice.blogspot.com/");
    const select1:Locator= page.locator('//td/input[@type="checkbox"]');
    await select1.nth(0).check();
    await expect(select1.nth(0)).toBeChecked();
    await page.waitForTimeout(2000);

    for(let i=0; i<await select1.count();i++)
    {
        await select1.nth(i).check();
        await expect(select1.nth(i)).toBeChecked();
        await page.waitForTimeout(1000);
        await select1.nth(i-1).uncheck();
    }
    

    for(let i=0; i<await select1.count();i++)
        {
        if(i>2)
        {
            select1.nth(i).check()
            await expect(select1.nth(i)).toBeChecked();
        }

    }
await page.waitForTimeout(3000);



})