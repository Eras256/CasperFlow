#![no_std]

use odra::prelude::*;
use odra::module::Module;

#[odra::module]
pub struct FlowFiFactor {
    pub invoices: Mapping<u64, Invoice>,
    pub invoice_count: Variable<u64>,
    pub factor_event: Event<InvoiceMinted>,
    pub fund_event: Event<InvoiceFunded>,
}

#[derive(OdraType, Debug, PartialEq, Eq)]
pub struct Invoice {
    pub id: u64,
    pub owner: Address,
    pub amount: U256,
    pub ipfs_hash: String,
    pub is_funded: bool,
}

#[derive(OdraType, Debug, PartialEq, Eq)]
pub struct InvoiceMinted {
    pub id: u64,
    pub owner: Address,
    pub amount: U256,
    pub ipfs_hash: String,
}

#[derive(OdraType, Debug, PartialEq, Eq)]
pub struct InvoiceFunded {
    pub id: u64,
    pub funder: Address,
    pub amount: U256,
}

#[odra::module]
impl FlowFiFactor {
    #[odra(init)]
    pub fn init(&mut self) {
        self.invoice_count.set(0);
    }

    pub fn mint_invoice(&mut self, amount: U256, ipfs_hash: String) {
        let id = self.invoice_count.get_or_default();
        let owner = self.env().caller();
        
        let invoice = Invoice {
            id,
            owner,
            amount: amount,
            ipfs_hash: ipfs_hash.clone(),
            is_funded: false,
        };

        self.invoices.set(&id, invoice);
        
        self.env().emit_event(InvoiceMinted {
            id,
            owner,
            amount,
            ipfs_hash,
        });

        self.invoice_count.set(id + 1);
    }

    #[odra(payable)]
    pub fn fund_invoice(&mut self, id: u64) {
        let mut invoice = self.invoices.get(&id).unwrap_or_revert_with(Error::InvoiceNotFound);
        
        if invoice.is_funded {
            self.env().revert(Error::AlreadyFunded);
        }

        let payment = self.env().attached_value();
        if payment < invoice.amount {
            self.env().revert(Error::InsufficientFunds);
        }

        // Update state
        invoice.is_funded = true;
        self.invoices.set(&id, invoice);

        // Transfer funds to the invoice owner
        self.env().transfer_tokens(&invoice.owner, payment);

        self.env().emit_event(InvoiceFunded {
            id,
            funder: self.env().caller(),
            amount: payment,
        });
    }

    pub fn get_invoice(&self, id: u64) -> Option<Invoice> {
        self.invoices.get(&id)
    }
}

#[derive(OdraType, Debug, PartialEq, Eq)]
pub enum Error {
    InvoiceNotFound,
    AlreadyFunded,
    InsufficientFunds,
}
