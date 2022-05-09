const { 
    fahrenheitToCelsius, 
    celsiusToFahrenheit,
    sum 
} = require('../playground/math');

test("Should convert 32 F to 0 C", ()=>{
    const value = fahrenheitToCelsius(32);
    expect(value).toBe(0);
});

test("Should convert 0 C to 32 F", ()=>{
    const value = celsiusToFahrenheit(0);
    expect(value).toBe(32);
});

test("Should give sum as 4 after 2 seconds", (done)=>{
    sum(2, 2).then((sum)=>{
        expect(sum).toBe(4);
        done();
    });
}, 3000);

test("Should get sum of using async/await", async ()=>{
    const value = await sum(10, 20);
    expect(value).toBe(30);
}, 3000);