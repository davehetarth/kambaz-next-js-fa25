const substract = (a: number, b: number) => {
  return a - b;
};

export default function ArrowFunctions() {
  const threeMinusOne = substract(3, 1);
  console.log(threeMinusOne);
  return (
    <div id="wd-arrow-functions">
      <h4>New ES6 arrow functions</h4>
      threeMinusOne = {threeMinusOne} <br />
      substract(3,1) = {substract(3, 1)} <hr />
    </div>
  );
}
