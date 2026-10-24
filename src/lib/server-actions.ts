import { createServerFn } from '@tanstack/react-start'
import {
  getLeaderboardData,
  createPlayer,
  recordMatch,
  deleteMatch,
  updatePlayer,
  deletePlayer,
  verifyAdminPasscode,
  setAdminPasscode,
  resetLeaderboardToDefaults,
} from './server-db.js'
import type {
  CreatePlayerPayload,
  RecordMatchPayload,
  DeleteMatchPayload,
  EditPlayerPayload,
  ChangePasscodePayload,
} from './types.js'

export const getLeaderboardFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    return await getLeaderboardData()
  },
)

export const verifyAdminFn = createServerFn({ method: 'POST' })
  .validator((data: { passcode: string }) => data)
  .handler(async ({ data }) => {
    const isValid = await verifyAdminPasscode(data.passcode)
    return { isValid }
  })

export const createPlayerFn = createServerFn({ method: 'POST' })
  .validator((data: CreatePlayerPayload) => data)
  .handler(async ({ data }) => {
    return await createPlayer(data)
  })

export const recordMatchFn = createServerFn({ method: 'POST' })
  .validator((data: RecordMatchPayload) => data)
  .handler(async ({ data }) => {
    return await recordMatch(data)
  })

export const deleteMatchFn = createServerFn({ method: 'POST' })
  .validator((data: DeleteMatchPayload) => data)
  .handler(async ({ data }) => {
    return await deleteMatch(data.id, data.adminPasscode)
  })

export const updatePlayerFn = createServerFn({ method: 'POST' })
  .validator((data: EditPlayerPayload) => data)
  .handler(async ({ data }) => {
    return await updatePlayer(data)
  })

export const deletePlayerFn = createServerFn({ method: 'POST' })
  .validator((data: { id: number; adminPasscode: string }) => data)
  .handler(async ({ data }) => {
    return await deletePlayer(data.id, data.adminPasscode)
  })

export const changePasscodeFn = createServerFn({ method: 'POST' })
  .validator((data: ChangePasscodePayload) => data)
  .handler(async ({ data }) => {
    return await setAdminPasscode(data.currentPasscode, data.newPasscode)
  })

export const resetLeaderboardFn = createServerFn({ method: 'POST' })
  .validator((data: { adminPasscode: string }) => data)
  .handler(async ({ data }) => {
    return await resetLeaderboardToDefaults(data.adminPasscode)
  })
