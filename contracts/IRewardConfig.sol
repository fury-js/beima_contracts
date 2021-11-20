pragma solidity ^0.8.0;


interface IRewardConfig{

    function CalculateIndividualSavingsReward(uint256 totalCycleTimeInSeconds, uint256 amountDeposited) external view returns(uint256);

    function CalculateCooperativeSavingsReward(uint256 totalCycleTimeInSeconds, uint256 amountDeposited) external view returns(uint256);
    
    function CalculateEsusuReward(uint256 totalCycleTimeInSeconds, uint256 amountDeposited) external view returns(uint256);
}