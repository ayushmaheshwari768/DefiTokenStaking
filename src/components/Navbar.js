import React, { Component } from 'react'
import coin from '../coin.jpeg'

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-blue fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={coin} width="40" height="40" className="d-inline-block align-top" alt="" />
          &nbsp; DeFi Token Staking
        </a>

        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondary">
              <small id="account">{this.props.account}</small>
            </small>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
