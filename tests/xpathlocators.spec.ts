import {test,expect, Locator} from "@playwright/test";
test("Xpath Demo in Playwright", async({page})=>{
    
    //1.Absolute Xpath- logo
    await page.goto("https://demowebshop.tricentis.com/");
    const absolutelogo:Locator= page.locator("xpath=/html[1]/body[1]/div[4]/div[1]/div[1]/div[1]/a[1]/img[1]");
    await expect(absolutelogo).toBeVisible();
    
    
    //2.Relative Xpath- logo
    const relativelogo:Locator= page.locator("img[alt='Tricentis Demo Web Shop']");
    await expect(relativelogo).toBeVisible();
   
   
    //3. contains()
    const products:Locator= page.locator("//h2/a[contains(@href,'computer')]");
    const productsCount:number=await products.count();
    console.log("Number of computer related products:", productsCount);
    expect (productsCount).toBeGreaterThan(0);
    // console.log(await products.textContent()); //stict mode violation error
    console.log("First computer related product:", await products.first().textContent());
    console.log("Last computer related product:", await products.last().textContent());
    console.log("Nth computer related product:", await products.nth(1).textContent());
    let productTitles:string[]= await products.allTextContents();
    console.log("All computer related product title", productTitles);
    for(let pt of productTitles)
    {
        console.log(pt);
    }
// starts with
const buildinproduct:Locator=page.locator("//h2/a[starts-with(@href,'/build')]");
const count:Number=await buildinproduct.count();
expect(count).toBeGreaterThan(0);

//5. Text() .
const reglnk:Locator=page.locator("//a[text()='Register']");
await expect(reglnk).toBeVisible();

//6 last()
const lastlink:Locator=page.locator("//div[@class='column follow-us']//li[last()]")
await expect(lastlink).toBeVisible();

})