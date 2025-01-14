async function main() {
  const PaynderContract = await ethers.getContractFactory("PaynderContract");
  const paynder = await PaynderContract.deploy();

  const deployedAddress = await paynder.getAddress();
  console.log("Contract deployment transaction submitted");

  await paynder.deploy;

  console.log("PaynderContract deployed to:", deployedAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
