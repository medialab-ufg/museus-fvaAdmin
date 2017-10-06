import React from'react';
import AnimationCount from'react-count-animation';
 
const Counter = () => {
    const settings = {
        start: 0,
        count: 999,
        duration: 1000,
        decimals: 0,
        useGroup: true,
        animation: 'up',
    };
    /* const settings2 = {
        start: 0,
        count: 3000,
        duration: 1000,
        decimals: 0,
        useGroup: true,
        animation: 'up',
    }; */
   
    return(
        <div>
            <h4 className="title">FVA Respondido</h4>
            <div className="exam-div">
                <AnimationCount {...settings}/>
            </div>
        </div>
    );
};
 
export default Counter;