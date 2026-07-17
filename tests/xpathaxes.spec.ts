import{test,expect, Locator} from "@playwright/test";
test("Xpath axes demo", async({page})=> {
    await page.goto("https://www.w3schools.com/html/html_tables.asp");
    //self
    const germanyCell:Locator= page.locator("//td[text()='Germany']/self::td");
    await expect(germanyCell).toHaveText('Germany');
    //parent axes
    const parentRow:Locator= page.locator("//td[text()='Germany']//parent::tr");
    await expect(parentRow).toContainText("Alfreds Futterkiste Maria Anders Germany");
    await console.log(await parentRow.textContent());
    //child axes
    const childrow:Locator= page.locator("//table[@id='customers']//tr[2]/child::td");
   await expect(childrow).toHaveCount(3);
  //Ancestor axes
  const ancestortable:Locator= page.locator("//td[text()='Germany']/ancestor::table");
  await expect(ancestortable).toHaveAttribute('id','customers');
  //descendent axes- get all <td> elements under the table
const descendentaxes:Locator= page.locator("//table[@id='customers']/descendant::td");
await expect(descendentaxes).toHaveCount(18);
// following axes - get the <td> that comes after "germany" in the document order
const Foll:Locator= page.locator("//td[normalize-space()='Germany']/following::td[1]");
await expect(Foll).toHaveText("Centro comercial Moctezuma");
// following sibling- get <td>s to the right of "germany"
const rightsibling:Locator= page.locator("//td[normalize-space()='Maria Anders']/following-sibling::td");
await expect(rightsibling).toHaveCount(1);
//Preceeding - get <td>s just before germany
const Preceed:Locator= page.locator("//td[.='Germany']/preceding::td[1]");
await expect(Preceed).toHaveText("Maria Anders");
// Preceeding sibling-get all <td> to the left of germany
const PreceedSib:Locator= page.locator("//td[.='Germany']/preceding-sibling::td");
await expect(PreceedSib).toHaveCount(2);
await expect(PreceedSib.nth(0)).toHaveText("Alfreds Futterkiste");
await expect(PreceedSib.nth(1)).toHaveText("Maria Anders");
})