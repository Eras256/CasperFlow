const { CLValueBuilder } = require('casper-js-sdk');
const { Some, None } = require('@casperlabs/ts-results');

const innerVal = CLValueBuilder.u8(1);
const innerType = innerVal.clType();

try {
    console.log("Creating Some(innerVal)...");
    const someVal = Some(innerVal);
    console.log("someVal:", someVal);

    console.log("Trying CLValueBuilder.option(someVal, innerType)...");
    const opt = CLValueBuilder.option(someVal, innerType);
    console.log("Success:", opt);

    // Testing specific arguments for deploy
    console.log("Testing minting_mode Option...");
    const val1 = CLValueBuilder.u8(1);
    const optMinting = CLValueBuilder.option(Some(val1), val1.clType());
    console.log("optMinting:", optMinting);

    console.log("Testing None Option...");
    const val0 = CLValueBuilder.u8(0); // Dummy for type
    const optNone = CLValueBuilder.option(None, val0.clType());
    console.log("optNone:", optNone);

} catch (e) {
    console.log("Failed:", e);
}
