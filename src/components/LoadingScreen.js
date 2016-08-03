import React from 'react';
import Preload from 'react-preload';


const LoadingScreen = () =>
  <div className="loading-screen">
    <Preload
        loadingIndicator={<div />}
        images={[require('../assets/images/infection_rate.png')]}
        autoResolveDelay={10000}
        resolveOnError={true}
        mountChildren={true}>
      <h1 className="text-danger">Loading...</h1>
      <img src={require('../assets/images/infection_rate.png')} />
    </Preload>
  </div>;

export default LoadingScreen;
