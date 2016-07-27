import React from 'react';


const LoadingScreen = () =>
  <div className="loading-screen">
    <h1 className="text-danger">Loading...</h1>
    <img src={require('../assets/images/infection_rate.png')} />
  </div>;

export default LoadingScreen;
