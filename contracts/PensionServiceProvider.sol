//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
import "./XendFinanceIndividual_Yearn_V1.sol";


import "hardhat/console.sol";


contract PensionServiceProvider is KeeperCompatibleInterface {
    XendFinanceIndividual_Yearn_V1 public xendFinance;


    IERC20 public busd;



    // A user Object
    struct User {
        uint256 id;
        address userAddress;
        string userDetails;
        uint256 depositedAmount;
        uint256 amountToSpend;
        uint256 approvedAmountToSpend;
        uint256 startTime;
        uint256 timeDurationOfdeposit;
        uint256 lockTime;
    }

    event EncodedData(bytes data);
    event DecodedData(uint256 _id, string _userDetails, uint256 _lockTime);

    mapping(address => User) public pensionServiceAppilcant;

    // keep track of registered users
    mapping(address => bool) public isRegistered;

    User[] public users;


    constructor(address _stableCoin, address _xendFinanceAddress )  {
        console.log("Contract created");
        busd = IERC20(_stableCoin);
        xendFinance = XendFinanceIndividual_Yearn_V1(_xendFinanceAddress);
        
    }

    function register(
        uint256 _id, 
        string memory _userDetails, 
        uint256 _amountToSpend,
        uint256 _approvedAmountToSpend,  
        uint256 _lockTime, 
        uint256 _timeDurationOfDeposit
        ) 
        public {
        require(!isRegistered[msg.sender], "Caller address already exists");

        User memory user = User({
            id: _id,
            userAddress: msg.sender,
            userDetails: _userDetails,
            depositedAmount: 0,
            amountToSpend: _amountToSpend,
            approvedAmountToSpend: _approvedAmountToSpend,
            startTime: block.timestamp,
            timeDurationOfdeposit: _timeDurationOfDeposit,
            lockTime:block.timestamp + _lockTime
        });

        pensionServiceAppilcant[msg.sender] = user;
        users.push(user);
        isRegistered[msg.sender] = true;
    }

    function deposit(uint256 _amount) public {

    }

    function checkUpkeep(bytes calldata ) external view override returns(bool upKeepNeeded, bytes memory ) {
        // bool upKeepNeeded;
        // bytes32 memory upKeepData;

        for(uint256 i = 0; i < users.length; i++ ) {
            if(block.timestamp > users[i].startTime + users[i].timeDurationOfdeposit) {
                User storage user = users[i];
                bytes memory upKeepData = abi.encode(user);
                upKeepNeeded = true;
                // users[i].startTime = block.timestamp;
                return (upKeepNeeded, upKeepData);
            }
        }

        

    }

    function performUpkeep(bytes calldata upKeepData) external override {
        (User memory userData) = abi.decode(upKeepData, (User));
        console.log("decoded struct");

        User storage user = pensionServiceAppilcant[userData.userAddress];
        // do something with the user
            require(busd.balanceOf(user.userAddress) >= user.amountToSpend, "Insufficient balance cannot perform upkeep");
            busd.transferFrom(user.userAddress, address(this), user.amountToSpend);
            // do something with Xend protocol.

            user.approvedAmountToSpend = user.approvedAmountToSpend - user.amountToSpend;
            user.depositedAmount = user.depositedAmount + user.amountToSpend;
            user.startTime = block.timestamp;

        emit DecodedData(user.id, user.userDetails, user.lockTime);
    }

    // function encode( uint256 _id, 
    //     string memory _userDetails, 
    //     uint256 _approvedAmountToSpend,  
    //     uint256 _lockTime, 
    //     uint256 _timeDurationOfDeposit
    //     ) public returns(bytes memory) 
    //     {

    //             User memory user = User({
    //             id: _id,
    //             userAddress: msg.sender,
    //             userDetails: _userDetails,
    //             depositedAmount: 0,
    //             approvedAmountToSpend: _approvedAmountToSpend,
    //             startTime: block.timestamp,
    //             timeDurationOfdeposit: _timeDurationOfDeposit,
    //             lockTime:block.timestamp + _lockTime
    //             });

    //         bytes memory updateData1 = abi.encode(user);

    //         emit EncodedData(updateData1);

    //         return updateData1;

    //     }
}