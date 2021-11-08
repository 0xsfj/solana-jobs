use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod solana_jobs {
    use super::*;
    pub fn initialize(ctx: Context<Start>) -> ProgramResult {
        // Get a reference to the account
        let base_account = &mut ctx.accounts.base_account;
        base_account.total_jobs = 0;
        Ok(())
    }

    pub fn add_job(ctx: Context<AddJob>) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        base_account.total_jobs += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Start<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddJob<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
}

#[account]
pub struct BaseAccount {
    pub total_jobs: u64,
}

// pub fn add_job(ctx: Context<AddJob>) -> ProgramResult {
//     // Get a reference to the account
//     let base_account = &mut ctx.accounts.base_account;

//     // Increment the total jobs
//     base_account.total_jobs += 1;

//     // Return the new total jobs
//     Ok(())
// }
