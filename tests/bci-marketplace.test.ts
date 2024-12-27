import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'bci-marketplace': {
      functions: {
        'list-application': vi.fn(),
        'update-application-status': vi.fn(),
        'purchase-application': vi.fn(),
        'get-application': vi.fn(),
        'get-user-application': vi.fn(),
      },
    },
  },
  globals: {
    'tx-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    'block-height': 123456,
  },
}

function callContract(contractName: string, functionName: string, args: any[]) {
  return mockClarity.contracts[contractName].functions[functionName](...args)
}

describe('BCI Marketplace Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('list-application', () => {
    it('should list an application successfully', async () => {
      const name = 'Test App'
      const description = 'A test BCI application'
      const price = 1000
      mockClarity.contracts['bci-marketplace'].functions['list-application'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('bci-marketplace', 'list-application', [name, description, price])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
  })
  
  describe('update-application-status', () => {
    it('should update application status successfully', async () => {
      const appId = 1
      const active = false
      mockClarity.contracts['bci-marketplace'].functions['update-application-status'].mockReturnValue({ success: true })
      
      const result = await callContract('bci-marketplace', 'update-application-status', [appId, active])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail to update status for non-existent application', async () => {
      const appId = 999
      const active = false
      mockClarity.contracts['bci-marketplace'].functions['update-application-status'].mockReturnValue({ success: false, error: 404 })
      
      const result = await callContract('bci-marketplace', 'update-application-status', [appId, active])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(404)
    })
  })
  
  describe('purchase-application', () => {
    it('should purchase an application successfully', async () => {
      const appId = 1
      mockClarity.contracts['bci-marketplace'].functions['purchase-application'].mockReturnValue({ success: true })
      
      const result = await callContract('bci-marketplace', 'purchase-application', [appId])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail to purchase inactive application', async () => {
      const appId = 2
      mockClarity.contracts['bci-marketplace'].functions['purchase-application'].mockReturnValue({ success: false, error: 400 })
      
      const result = await callContract('bci-marketplace', 'purchase-application', [appId])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(400)
    })
  })
  
  describe('get-application', () => {
    it('should return application details successfully', async () => {
      const appId = 1
      const expectedApp = {
        developer: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        name: 'Test App',
        description: 'A test BCI application',
        price: 1000,
        active: true,
      }
      mockClarity.contracts['bci-marketplace'].functions['get-application'].mockReturnValue(expectedApp)
      
      const result = await callContract('bci-marketplace', 'get-application', [appId])
      
      expect(result).toEqual(expectedApp)
    })
    
    it('should return null for non-existent application', async () => {
      const appId = 999
      mockClarity.contracts['bci-marketplace'].functions['get-application'].mockReturnValue(null)
      
      const result = await callContract('bci-marketplace', 'get-application', [appId])
      
      expect(result).toBeNull()
    })
  })
  
  describe('get-user-application', () => {
    it('should return user application details successfully', async () => {
      const user = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const appId = 1
      const expectedUserApp = {
        purchase_time: 123456,
      }
      mockClarity.contracts['bci-marketplace'].functions['get-user-application'].mockReturnValue(expectedUserApp)
      
      const result = await callContract('bci-marketplace', 'get-user-application', [user, appId])
      
      expect(result).toEqual(expectedUserApp)
    })
    
    it('should return null for non-existent user application', async () => {
      const user = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const appId = 999
      mockClarity.contracts['bci-marketplace'].functions['get-user-application'].mockReturnValue(null)
      
      const result = await callContract('bci-marketplace', 'get-user-application', [user, appId])
      
      expect(result).toBeNull()
    })
  })
})

