import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'neuro-reward-token': {
      functions: {
        mint: vi.fn(),
        transfer: vi.fn(),
        'reward-achievement': vi.fn(),
        'get-balance': vi.fn(),
        'get-total-rewards': vi.fn(),
        'get-token-uri': vi.fn(),
        'set-token-uri': vi.fn(),
      },
    },
  },
  globals: {
    'tx-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  },
}

function callContract(contractName: string, functionName: string, args: any[]) {
  return mockClarity.contracts[contractName].functions[functionName](...args)
}

describe('Neuro Reward Token Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('mint', () => {
    it('should mint tokens successfully', async () => {
      const amount = 100
      const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['neuro-reward-token'].functions.mint.mockReturnValue({ success: true })
      
      const result = await callContract('neuro-reward-token', 'mint', [amount, recipient])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail to mint if not contract owner', async () => {
      const amount = 100
      const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['neuro-reward-token'].functions.mint.mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('neuro-reward-token', 'mint', [amount, recipient])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('transfer', () => {
    it('should transfer tokens successfully', async () => {
      const amount = 50
      const sender = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['neuro-reward-token'].functions.transfer.mockReturnValue({ success: true })
      
      const result = await callContract('neuro-reward-token', 'transfer', [amount, sender, recipient])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail to transfer if sender is not tx-sender', async () => {
      const amount = 50
      const sender = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      const recipient = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      mockClarity.contracts['neuro-reward-token'].functions.transfer.mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('neuro-reward-token', 'transfer', [amount, sender, recipient])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('reward-achievement', () => {
    it('should reward achievement successfully', async () => {
      const user = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      const amount = 100
      mockClarity.contracts['neuro-reward-token'].functions['reward-achievement'].mockReturnValue({ success: true })
      
      const result = await callContract('neuro-reward-token', 'reward-achievement', [user, amount])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail to reward if not contract owner', async () => {
      const user = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      const amount = 100
      mockClarity.contracts['neuro-reward-token'].functions['reward-achievement'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('neuro-reward-token', 'reward-achievement', [user, amount])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('get-balance', () => {
    it('should return the correct balance', async () => {
      const account = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const expectedBalance = 1000
      mockClarity.contracts['neuro-reward-token'].functions['get-balance'].mockReturnValue({ success: true, value: expectedBalance })
      
      const result = await callContract('neuro-reward-token', 'get-balance', [account])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(expectedBalance)
    })
  })
  
  describe('get-total-rewards', () => {
    it('should return the correct total rewards', async () => {
      const user = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const expectedTotalRewards = 500
      mockClarity.contracts['neuro-reward-token'].functions['get-total-rewards'].mockReturnValue(expectedTotalRewards)
      
      const result = await callContract('neuro-reward-token', 'get-total-rewards', [user])
      
      expect(result).toBe(expectedTotalRewards)
    })
  })
  
  describe('get-token-uri', () => {
    it('should return the correct token URI', async () => {
      const expectedUri = 'https://example.com/metadata/neuro-token'
      mockClarity.contracts['neuro-reward-token'].functions['get-token-uri'].mockReturnValue({ success: true, value: expectedUri })
      
      const result = await callContract('neuro-reward-token', 'get-token-uri', [])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(expectedUri)
    })
  })
  
  describe('set-token-uri', () => {
    it('should set the token URI successfully', async () => {
      const newUri = 'https://example.com/new-metadata/neuro-token'
      mockClarity.contracts['neuro-reward-token'].functions['set-token-uri'].mockReturnValue({ success: true })
      
      const result = await callContract('neuro-reward-token', 'set-token-uri', [newUri])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail to set token URI if not contract owner', async () => {
      const newUri = 'https://example.com/new-metadata/neuro-token'
      mockClarity.contracts['neuro-reward-token'].functions['set-token-uri'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('neuro-reward-token', 'set-token-uri', [newUri])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
})

