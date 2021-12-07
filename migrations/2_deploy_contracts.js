const SpartanCoin = artifacts.require('SpartanCoin')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(DaiToken)
  const daiToken = await DaiToken.deployed()

  await deployer.deploy(SpartanCoin)
  const spartanCoin = await SpartanCoin.deployed()
  await deployer.deploy(TokenFarm, spartanCoin.address, daiToken.address)
  const tokenFarm = await TokenFarm.deployed()

  await spartanCoin.transfer(tokenFarm.address, '1000000000000000000000000')

  await daiToken.transfer(accounts[1], '100000000000000000000') 
}
