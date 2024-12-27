import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'neurofeedback-training': {
      functions: {
        'create-program': vi.fn(),
        'update-program-status': vi.fn(),
        'enroll-in-program': vi.fn(),
        'complete-program': vi.fn(),
        'get-program': vi.fn(),
        'get-user-program': vi.fn(),
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

describe('Neurofeedback Training Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('create-program', () => {
    it('should create a training program successfully', async () => {
      const name = 'Test Program'
      const description = 'A test neurofeedback program'
      const duration = 100
      const price = 1000
      mockClarity.contracts['neurofeedback-training'].functions['create-program'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('neurofeedback-training', 'create-program', [name, description, duration, price])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
  })
  
  describe('update-program-status', () => {
    it('should update program status successfully', async () => {
      const programId = 1
      const active = false
      mockClarity.contracts['neurofeedback-training'].functions['update-program-status'].mockReturnValue({ success: true })
      
      const result = await callContract('neurofeedback-training', 'update-program-status', [programId, active])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail to update status for non-existent program', async () => {
      const programId = 999
      const active = false
      mockClarity.contracts['neurofeedback-training'].functions['update-program-status'].mockReturnValue({ success: false, error: 404 })
      
      const result = await callContract('neurofeedback-training', 'update-program-status', [programId, active])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(404)
    })
  })
  
  describe('enroll-in-program', () => {
    it('should enroll user in program successfully', async () => {
      const programId = 1
      mockClarity.contracts['neurofeedback-training'].functions['enroll-in-program'].mockReturnValue({ success: true })
      
      const result = await callContract('neurofeedback-training', 'enroll-in-program', [programId])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail to enroll in inactive program', async () => {
      const programId = 2
      mockClarity.contracts['neurofeedback-training'].functions['enroll-in-program'].mockReturnValue({ success: false, error: 400 })
      
      const result = await callContract('neurofeedback-training', 'enroll-in-program', [programId])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(400)
    })
  })
  
  describe('complete-program', () => {
    it('should mark program as completed successfully', async () => {
      const programId = 1
      mockClarity.contracts['neurofeedback-training'].functions['complete-program'].mockReturnValue({ success: true })
      
      const result = await callContract('neurofeedback-training', 'complete-program', [programId])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail to complete non-existent program', async () => {
      const programId = 999
      mockClarity.contracts['neurofeedback-training'].functions['complete-program'].mockReturnValue({ success: false, error: 404 })
      
      const result = await callContract('neurofeedback-training', 'complete-program', [programId])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(404)
    })
  })
  
  describe('get-program', () => {
    it('should return program details successfully', async () => {
      const programId = 1
      const expectedProgram = {
        creator: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        name: 'Test Program',
        description: 'A test neurofeedback program',
        duration: 100,
        price: 1000,
        active: true,
      }
      mockClarity.contracts['neurofeedback-training'].functions['get-program'].mockReturnValue(expectedProgram)
      
      const result = await callContract('neurofeedback-training', 'get-program', [programId])
      
      expect(result).toEqual(expectedProgram)
    })
    
    it('should return null for non-existent program', async () => {
      const programId = 999
      mockClarity.contracts['neurofeedback-training'].functions['get-program'].mockReturnValue(null)
      
      const result = await callContract('neurofeedback-training', 'get-program', [programId])
      
      expect(result).toBeNull()
    })
  })
  
  describe('get-user-program', () => {
    it('should return user program details successfully', async () => {
      const user = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const programId = 1
      const expectedUserProgram = {
        start_time: 123456,
        completed: false,
      }
      mockClarity.contracts['neurofeedback-training'].functions['get-user-program'].mockReturnValue(expectedUserProgram)
      
      const result = await callContract('neurofeedback-training', 'get-user-program', [user, programId])
      
      expect(result).toEqual(expectedUserProgram)
    })
    
    it('should return null for non-existent user program', async () => {
      const user = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const programId = 999
      mockClarity.contracts['neurofeedback-training'].functions['get-user-program'].mockReturnValue(null)
      
      const result = await callContract('neurofeedback-training', 'get-user-program', [user, programId])
      
      expect(result).toBeNull()
    })
  })
})

