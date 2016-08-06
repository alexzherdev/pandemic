import React from 'react';
import { Link } from 'react-router';
import { OutboundLink } from 'react-ga';


const Footer = () =>
  <footer>
    <div>
      <small>Made by Alex Zherdev in 2016.</small>
    </div>
    <div>
      <OutboundLink
        eventLabel="outboundGithub"
        to="https://github.com/alexzherdev/pandemic"
        className="github"
        target="_blank">
        <img src={require('../../assets/images/github.png')} />
      </OutboundLink>
      <OutboundLink
        eventLabel="outboundTwitter"
        to="https://twitter.com/endymion_r"
        className="twitter"
        target="_blank">
        <img src={require('../../assets/images/twitter.png')} />
      </OutboundLink>
      <OutboundLink
        eventLabel="outboundLinkedin"
        to="https://www.linkedin.com/in/alex-zherdev"
        target="_blank">
        <img src={require('../../assets/images/linkedin.png')} />
      </OutboundLink>
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
