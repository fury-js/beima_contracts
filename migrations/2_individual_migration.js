const Web3 = require("web3");
const DaiContractAddress = "0x95b58a6bff3d14b7db2f5cb5f0ad413dc2940658";
const GroupsContract = artifacts.require("Groups");
const TreasuryContract = artifacts.require("Treasury");
const ClientRecordContract = artifacts.require("ClientRecord");
const SavingsConfigContract = artifacts.require("SavingsConfig");
const VenusAdapter = artifacts.require("VenusAdapter");
const VenusLendingService = artifacts.require("VenusLendingService");
const XendFinanceIndividual_Yearn_V1Contract = artifacts.require(
  "XendFinanceIndividual_Yearn_V1"
);
const RewardConfigContract = artifacts.require("RewardConfig");
const XendTokenContract = artifacts.require("XendToken");
const EsusuServiceContract = artifacts.require("EsusuService");
const busdAddress = "0x043D1F90f86Fd36dbf8b9be38B0703B8dF83Ecf4"
const ibbusdAddress = "0x043D1F90f86Fd36dbf8b9be38B0703B8dF83Ecf4"
const EsusuAdapterContract = artifacts.require('EsusuAdapter');
const EsusuAdapterWithdrawalDelegateContract = artifacts.require('EsusuAdapterWithdrawalDelegate');
const EsusuStorageContract = artifacts.require('EsusuStorage');
const RewardBridgeContract = artifacts.require('RewardBridge');
const PensionServiceProvider = artifacts.require("PensionServiceProvider");
const BUSD = artifacts.require("BEP20Token.sol");
// const vBUSD =artifacts.require("VBep20Delegator.sol");
// const web3 = new Web3("HTTP://127.0.0.1:8545");
// const daiContract = new web3.eth.Contract(DaiContractABI, DaiContractAddress);

module.exports = function (deployer, network, accounts) {
  deployer.then(async () => {
    await deployer.deploy(GroupsContract);

    console.log("GroupsContract address: " + GroupsContract.address);

    await deployer.deploy(TreasuryContract);

    console.log("TreasuryContract address: " + TreasuryContract.address);

    await deployer.deploy(ClientRecordContract);

    console.log("ClientRecordContract address", ClientRecordContract.address);

    await deployer.deploy(SavingsConfigContract);

    console.log("Savings config address", SavingsConfigContract.address);

    await deployer.deploy(EsusuServiceContract);

    console.log(
      "EsusuServiceContract address: " + EsusuServiceContract.address
    );

    await deployer.deploy(
      RewardConfigContract,
      EsusuServiceContract.address,
      GroupsContract.address
    );

    console.log(
      "RewardConfigContract address: " + RewardConfigContract.address
    );

    await deployer.deploy(XendTokenContract, "Xend Token", "$XEND", "18", "200000000000000000000000000");

    console.log("Xend Token Contract address", XendTokenContract.address);
    
    await deployer.deploy(RewardBridgeContract, XendTokenContract.address);
    console.log("Reward Bridge Contract address", RewardBridgeContract.address);


    await deployer.deploy(VenusLendingService);

    console.log(
      "venusLendingService Contract address: " + VenusLendingService.address
    );

    await deployer.deploy(
      VenusAdapter,
      VenusLendingService.address
    );

    console.log(
      "VenusAdapter address: " + VenusAdapter.address
    );


     await deployer.deploy(EsusuStorageContract);

    //  address payable serviceContract, address esusuStorageContract, address esusuAdapterContract,
    //                 string memory feeRuleKey, address treasuryContract, address rewardConfigContract, address xendTokenContract

     await deployer.deploy(EsusuAdapterContract,
                            EsusuServiceContract.address,
                            GroupsContract.address,
                            EsusuStorageContract.address);

      await deployer.deploy(EsusuAdapterWithdrawalDelegateContract,
                              EsusuServiceContract.address,
                              EsusuStorageContract.address,
                              EsusuAdapterContract.address,
                              "esusufee",
                              TreasuryContract.address,
                              RewardConfigContract.address,
                              XendTokenContract.address,
                              SavingsConfigContract.address);
    
    

    await deployer.deploy(
      XendFinanceIndividual_Yearn_V1Contract,
      VenusLendingService.address,
      busdAddress,
      ClientRecordContract.address,
      GroupsContract.address,
      SavingsConfigContract.address,
      ibbusdAddress,
      RewardConfigContract.address,
      XendTokenContract.address,
      TreasuryContract.address
    );

    console.log(
      "Xend finance individual",
      XendFinanceIndividual_Yearn_V1Contract.address
    );

    await deployer.deploy(BUSD)
    const busd = await BUSD.deployed();

    console.log("BUSD deployed at:", BUSD.address);

    // await deployer.deploy(
    //   vBUSD, 
    //   BUSD.address,
    //   0x06d00a26EfA71A2DE12C83062f332d41b5E737BA, 
    //   0x06d00a26EfA71A2DE12C83062f332d41b5E737BA,
    //   1*10^18,
    //   "vBUSD",
    //   "vBUSD",
    //   18,
    //   accounts[0],
    //   accounts[0],
    //   "0x"

    // )
    // const vbusd = await vBUSD.deployed();

    // console.log("vBUSD deployed at:", vBUSD.address);

    await deployer.deploy(PensionServiceProvider, BUSD.address, XendFinanceIndividual_Yearn_V1Contract.address)
    const pensionServiceProvider = await PensionServiceProvider.deployed();

    console.log("PensionServiceProvider deployed at:", PensionServiceProvider.address);
   
    let savingsConfigContract = null
    let xendTokenContract = null;
    let groupsContract =null;
    let venusLendingService = null;
    let rewardConfigContract = null;
    let clientRecordContract = null;
    let individualContract = null;
    let esusuAdapterContract = null;
    let esusuAdapterWithdrawalDelegateContract = null;
    let esusuStorageContract = null;
    let esusuServiceContract = null;
    let rewardBridgeContract = null;
    

    savingsConfigContract = await SavingsConfigContract.deployed();
    xendTokenContract = await XendTokenContract.deployed();
    venusLendingService = await VenusLendingService.deployed();
    groupsContract = await GroupsContract.deployed();
    clientRecordContract = await ClientRecordContract.deployed();
    rewardConfigContract = await RewardConfigContract.deployed();
    individualContract = await XendFinanceIndividual_Yearn_V1Contract.deployed();
    esusuAdapterWithdrawalDelegateContract = await EsusuAdapterWithdrawalDelegateContract.deployed();
    esusuStorageContract = await EsusuStorageContract.deployed();
    esusuAdapterContract = await EsusuAdapterContract.deployed();
    esusuServiceContract = await EsusuServiceContract.deployed();
    rewardBridgeContract = await RewardBridgeContract.deployed();


     await savingsConfigContract.createRule("XEND_FEE_PRECISION",0,0,100,1);

     await savingsConfigContract.createRule("PERCENTAGE_AS_PENALTY",0,0,10,1);

     await savingsConfigContract.createRule("PERCENTAGE_PAYOUT_TO_USERS",0,0,150,1);

     await savingsConfigContract.createRule("XEND_FINANCE_COMMISION_DIVIDEND",0,0,200,1);
     await savingsConfigContract.createRule("XEND_FINANCE_COMMISION_FLEXIBLE_DIVIDEND",0,0,1,1);


    
  });
};
