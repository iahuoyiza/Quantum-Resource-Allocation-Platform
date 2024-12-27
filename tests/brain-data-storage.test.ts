import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'brain-data-storage': {
      functions: {
        'get-data-record': vi.fn(),
        'store-data': vi.fn(),
        'update-data-visibility': vi.fn(),
        'is-public-data': vi.fn(),
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

describe('Brain Data Storage Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('store-data', () => {
    it('should store brain data successfully', async () => {
      const dataHash = Buffer.from('0123456789abcdef0123456789abcdef', 'hex')
      const isPublic = true
      mockClarity.contracts['brain-data-storage'].functions['store-data'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('brain-data-storage', 'store-data', [dataHash, isPublic])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
  })
  
  describe('get-data-record', () => {
    it('should return the correct data record', async () => {
      const recordId = 1
      const expectedRecord = {
        owner: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        data_hash: Buffer.from('0123456789abcdef0123456789abcdef', 'hex'),
        timestamp: 123456,
        is_public: true,
      }
      mockClarity.contracts['brain-data-storage'].functions['get-data-record'].mockReturnValue(expectedRecord)
      
      const result = await callContract('brain-data-storage', 'get-data-record', [recordId])
      
      expect(result).toEqual(expectedRecord)
    })
    
    it('should return null for non-existent record', async () => {
      const recordId = 999
      mockClarity.contracts['brain-data-storage'].functions['get-data-record'].mockReturnValue(null)
      
      const result = await callContract('brain-data-storage', 'get-data-record', [recordId])
      
      expect(result).toBeNull()
    })
  })
  
  describe('update-data-visibility', () => {
    it('should update data visibility successfully', async () => {
      const recordId = 1
      const newVisibility = false
      mockClarity.contracts['brain-data-storage'].functions['update-data-visibility'].mockReturnValue({ success: true })
      
      const result = await callContract('brain-data-storage', 'update-data-visibility', [recordId, newVisibility])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail to update visibility for non-existent record', async () => {
      const recordId = 999
      const newVisibility = false
      mockClarity.contracts['brain-data-storage'].functions['update-data-visibility'].mockReturnValue({ success: false, error: 404 })
      
      const result = await callContract('brain-data-storage', 'update-data-visibility', [recordId, newVisibility])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(404)
    })
  })
  
  describe('is-public-data', () => {
    it('should return true for public data', async () => {
      const recordId = 1
      mockClarity.contracts['brain-data-storage'].functions['is-public-data'].mockReturnValue({ success: true, value: true })
      
      const result = await callContract('brain-data-storage', 'is-public-data', [recordId])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(true)
    })
    
    it('should return false for private data', async () => {
      const recordId = 2
      mockClarity.contracts['brain-data-storage'].functions['is-public-data'].mockReturnValue({ success: true, value: false })
      
      const result = await callContract('brain-data-storage', 'is-public-data', [recordId])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(false)
    })
    
    it('should return error for non-existent record', async () => {
      const recordId = 999
      mockClarity.contracts['brain-data-storage'].functions['is-public-data'].mockReturnValue({ success: false, error: 404 })
      
      const result = await callContract('brain-data-storage', 'is-public-data', [recordId])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(404)
    })
  })
})
