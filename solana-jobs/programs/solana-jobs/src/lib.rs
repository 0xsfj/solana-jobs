use anchor_lang::prelude::*;

declare_id!("BVMLaLJdNrAMF7qNUoGp4cx4NrgCthV8iK6rwgkuDK1g");

#[program]
pub mod solana_jobs {
    use super::*;
    pub fn initialize(ctx: Context<Start>) -> ProgramResult {
        // Get a reference to the account
        let base_account = &mut ctx.accounts.base_account;
        base_account.total_jobs = 0;
        Ok(())
    }

    pub fn add_job(ctx: Context<AddJob>, job_link: String) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;

        let item = ItemStruct {
            job_link: job_link.to_string(),
            user_address: *base_account.to_account_info().key,
        };

        base_account.job_list.push(item);
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

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub job_link: String,
    pub user_address: Pubkey,
}

#[account]
pub struct BaseAccount {
    pub total_jobs: u64,
    pub job_list: Vec<ItemStruct>,
}

// pub fn add_job(ctx: Context<AddJob>) -> ProgramResult {
//     // Get a reference to the account
//     let base_account = &mut ctx.accounts.base_account;

//     // Increment the total jobs
//     base_account.total_jobs += 1;

//     // Return the new total jobs
//     Ok(())
// }
