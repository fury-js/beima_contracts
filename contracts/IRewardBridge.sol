pragma solidity ^0.8.0;


interface IRewardBridge  {

    function rewardUser(uint256 amount, address recipient) external;

    function updateTokenAddress(address newTokenAddress) external;

    function withdrawTokens(address tokenAddress) external;

    function withdrawTokens() external;
    function getTokenAddress() external view returns (address);
}
