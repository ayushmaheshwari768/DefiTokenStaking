import React, { Component } from 'react'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import SpartanCoin from '../abis/SpartanCoin.json'
import TokenFarm from '../abis/TokenFarm.json'
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }

    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }

    else {
      window.alert('Install MetaMask')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const netId = await web3.eth.net.getId()

    const daiData = DaiToken.networks[netId]
    if(daiData) {
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiData.address)
      this.setState({daiToken})
      let daiBalance = await daiToken.methods.balanceOf(this.state.account).call()
      this.setState({daiBalance: daiBalance.toString()})
    } else {
      window.alert('DaiToken contract: Not deployed to Ganache network')
    }

    const spartanCoinData = SpartanCoin.networks[netId]
    
    if ( spartanCoinData ) {
      const spartanCoin = new web3.eth.Contract(SpartanCoin.abi, spartanCoinData.address)
      this.setState({spartanCoin})

      let spartanCoinBalance = await spartanCoin.methods.balance(this.state.account).call()
      this.setState({spartanCoinBalance: spartanCoinBalance.toString()})
    } 
    else {
      window.alert('Spartan Coin contract: Not deployed to Ganache network')
    }

    const farmData = TokenFarm.networks[netId]
    if ( farmData ) {
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, farmData.address)
      this.setState({tokenFarm})
      let stakingBalance = await tokenFarm.methods.balance(this.state.account).call()
      this.setState({stakingBalance: stakingBalance.toString()})
    } 
    else {
      window.alert('TokenFarm contract: Not deployed to Ganache network.')
    }

    this.setState({ loading: false })
  }

  stakeTokens = (amount) => {
    this.setState({loading: true})
    this.state.daiToken.methods.approve(this.state.tokenFarm._address, amount).send({from: this.state.account}).on('transactionHash', (hash) => {
      this.state.tokenFarm.methods.stakeTokens(amount).send({from: this.state.account}).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  unstakeTokens = (amount) => {
    this.setState({loading: true})

    this.state.tokenFarm.methods.unstakeTokens().send({from: this.state.account}).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      daiToken: {},
      spartanCoin: {},
      tokenFarm: {},
      daiBalance: '0',
      spartanCoinBalance: '0',
      stakingBalance: '0',
      loading: true
    }
  }

  render() {
    let content

    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading</p>
    } 

    else {
      content = <Main
        daiBalance={this.state.daiBalance}
        spartanCoinBalance={this.state.spartanCoinBalance}

        stakingBalance={this.state.stakingBalance}
        stakeTokens={this.stakeTokens}
        unstakeTokens={this.unstakeTokens}
      />
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
