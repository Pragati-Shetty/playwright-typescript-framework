

import { Locator } from "@playwright/test";
import {test,expect} from "@playwright/test";


//text input/text Box/Input Box
test('Test Input Actions', async({page})=> {
    await page.goto("https://testautomationpractice.blogspot.com");
   const textbox:Locator=page.locator('#name');
   await expect (textbox).toBeVisible();
   await expect(textbox).toBeEnabled();
   const maxLength: string | null= await textbox.getAttribute("maxlength"); //returns the value of maxlength of the element
   expect (maxLength).toBe('15');
   await textbox.fill("John Canedy");
   //console.log("Text content of First Name:", await textbox.textContent());//returns empty
   
   const enteredValue:String= await textbox.inputValue();
   console.log("Text content of First Name:", enteredValue);// returns input value
    await expect (enteredValue).toBe("John Canedy");
    await page.waitForTimeout(3000);


})

//Radio button
test("Radio button actions", async({page})=>{
    await page.goto("https://testautomationpractice.blogspot.com/");
    const maleRadio:Locator= page.locator("#male");//male radio button
    await expect(maleRadio).toBeVisible();
    await expect(maleRadio).toBeEnabled();
    expect(await maleRadio.isChecked()).toBe(false);
    
    await maleRadio.check(); //select the radio button
    //expect (await maleRadio.isChecked()).toBe(true);//boolean
    expect(maleRadio).toBeChecked();
    
    await page.waitForTimeout(3000);

})
test("Checkbox actions", async({page})=>{
    await page.goto("https://testautomationpractice.blogspot.com/");
    const checkboxSunday:Locator= page.getByLabel("Sunday");
    //await checkboxSunday.check();
    //await expect (checkboxSunday).toBeChecked();
   


    //2. Select all checkboxes and assert each is checked
const days:string[]=['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday','Friday','Saturday'];
const checkboxes:Locator[]=days.map(index=> page.getByLabel(index));
expect (checkboxes.length).toBe(7);


//3. select all checkboxes
for(const checkbox of checkboxes)
{
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    
}
await page.waitForTimeout(3000);


//4 unceck last 3 checkboxes
for(const checkbox of checkboxes.slice(-3))
{
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
}
await page.waitForTimeout(3000);

//5. toggle checkboxes: if checked, uncheck ; if unchecked, then check. assert state flipped 
for(const checkbox of checkboxes)
{
    
    if(await checkbox.isChecked())  //if true then execute
    {
    //Only if checked
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
    }
    else{
    //only if not checked 
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    }
}
//7 randomly select check boxes

const indexes:number[]= [1,3,6];
for(const i of indexes)
{
   await checkboxes[i].check();
    await expect(checkboxes[i]).toBeChecked();
}
await page.waitForTimeout(3000);


//8. select the checkbox based on the input
const weekname:String="Friday";
for(const label of days)
    if(label===weekname)
    {
        const checkbo:Locator=page.getByLabel(label);
        checkbo.click();
        await expect(checkbo).toBeChecked();
    }
await page.waitForTimeout(3000);


})

