import React from 'react';
import { Link } from 'react-router';


const Footer = () =>
  <footer>
    <div>
      <small>Made by Alex Zherdev in 2016.</small>
    </div>
    <div>
      <a
        href="https://github.com/alexzherdev/pandemic"
        className="github"
        target="blank">
        <img src={require('../../assets/images/github.png')} />
      </a>
      <a
        href="https://twitter.com/endymion_r"
        className="twitter"
        target="blank">
        <img src={require('../../assets/images/twitter.png')} />
      </a>
      <a
        href="https://www.linkedin.com/in/alex-zherdev"
        target="blank">
        <img src={require('../../assets/images/linkedin.png')} />
      </a>
    </div>
    <div>
      <Link
        to="credits"
        className="credits">
        <small>Credits</small>
      </Link>
    </div>
  </footer>;

export default Footer;
