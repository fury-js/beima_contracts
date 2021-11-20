pragma solidity ^0.8.0;

interface ISavingsConfigSchema {
    struct RuleSet {
        uint256 minimum;
        uint256 maximum;
        uint256 exact;
        bool applies;
        RuleDefinition ruleDefinition;
        bool exists;
    }

    enum RuleDefinition {RANGE, VALUE}
}
