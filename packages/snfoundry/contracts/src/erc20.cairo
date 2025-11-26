use starknet::ContractAddress;

#[starknet::interface]
pub trait IERC20Token <TContractState> {
    fn totalSupply(self: @TContractState) -> u256;
    fn balanceOf(self: @TContractState, account: ContractAddress) -> u256;
    fn transfer(ref self: TContractState, to: ContractAddress, amount: u256) -> bool;
    fn allowance(self: @TContractState, owner: ContractAddress, spender: ContractAddress) -> u256;
    fn approve(ref self: TContractState, spender: ContractAddress, amount: u256) -> bool;
    fn transferFrom(ref self: TContractState, from: ContractAddress, to: ContractAddress, amount: u256) -> bool;
    fn burn(ref self: TContractState, amount: u256) -> bool;
    fn mint(ref self: TContractState, to: ContractAddress, amount: u256) -> bool;
}

#[starknet::contract]
pub mod ERC20Contract {
    use super::IERC20Token;
    use starknet::storage::{StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess, StoragePointerWriteAccess, Map};
    use starknet::{get_caller_address, ContractAddress};
    use core::num::traits::Zero;

    #[storage]
    struct Storage {
        total_supply: u256,
        balances: Map<ContractAddress, u256>,
        allowances: Map<(ContractAddress, ContractAddress), u256>,
        name: ByteArray,
        symbol: ByteArray,
        decimals: u8
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        name: ByteArray,
        symbol: ByteArray,
        decimals: u8,
    ) {
        self.name.write(name);
        self.symbol.write(symbol);
        self.decimals.write(decimals)
    }

    #[abi(embed_v0)]
    impl implERC20Token of IERC20Token<ContractState> {
        fn totalSupply(self: @ContractState) -> u256 {
            self.total_supply.read()
        }

        fn balanceOf(self: @ContractState, account: ContractAddress) -> u256 {
            assert!(!account.is_zero(), "Invalid account address");
            self.balances.read(account)
        }

        fn transfer(ref self: ContractState, to: ContractAddress, amount: u256) -> bool {
            assert!(!to.is_zero(), "Invalid account address");
            assert!(amount > 0, "Transfer amount must be greater than zero")

            let sender = get_caller_address();
            let sender_balance = self.balances.read(sender);

            assert!(sender_balance >= amount, "Insufficient balance")

            self.balances.write(sender, sender_balance - amount);
            let recipient_balance = self.balances.read(to);
            self.balances.write(to, recipient_balance + amount);

            true
        }

        fn allowance(self: @ContractState, owner: ContractAddress, spender: ContractAddress) -> u256 {
            assert!(!owner.is_zero(), "Invalid owner address");
            assert!(!spender.is_zero(), "Invalid spender address");
            self.allowances.read((owner, spender))
        }

        fn approve(ref self: ContractState, spender: ContractAddress, amount: u256) -> bool {
            assert!(!spender.is_zero(), "Invalid spender address");
            assert!(amount >= 0, "Approval amount must be non-negative");

            let owner = get_caller_address();
            self.allowances.write((owner, spender), amount);

            true
        }

        fn transferFrom(ref self: ContractState, from: ContractAddress, to: ContractAddress, amount: u256) -> bool {
            assert!(!from.is_zero(), "Invalid from address");
            assert!(!to.is_zero(), "Invalid to address");
            assert!(amount > 0, "Transfer amount must be greater than zero");

            let spender = get_caller_address();
            let current_allowance = self.allowances.read((from, spender));
            assert!(current_allowance >= amount, "Transfer amount exceeds allowance");

            let from_balance = self.balances.read(from);
            assert!(from_balance >= amount, "Insufficient balance");

            self.balances.write(from, from_balance - amount);
            let to_balance = self.balances.read(to);
            self.balances.write(to, to_balance + amount);
            self.allowances.write((from, spender), current_allowance - amount);

            true
        }

        fn burn(ref self: ContractState, amount: u256) -> bool {
            assert!(amount > 0, "Burn amount must be greater than zero");

            let caller = get_caller_address();
            let caller_balance = self.balances.read(caller);
            assert!(caller_balance >= amount, "Insufficient balance to burn");

            self.balances.write(caller, caller_balance - amount);
            let current_total_supply = self.total_supply.read();
            self.total_supply.write(current_total_supply - amount);

            true
        }

        fn mint(ref self: ContractState, to: ContractAddress, amount: u256) -> bool {
            assert!(!to.is_zero(), "Invalid to address");
            assert!(amount > 0, "Mint amount must be greater than zero");

            let balance = self.balances.read(to);
            self.balances.write(to, balance + amount);

            let current_total_supply = self.total_supply.read();
            self.total_supply.write(current_total_supply + amount);

            true
        }

    }
}