import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '@/database'
import { errorHandler, validateToken } from '@/utils'
import { ErrorModel, SuccessModel } from '@/interfaces'

import { TrashNoteListResult } from './_interfaces'

const handler = async (
  request: NextApiRequest,
  response: NextApiResponse<(TrashNoteListResult & SuccessModel) | SuccessModel | ErrorModel>
) => {
  try {
    if (request.method === 'OPTIONS') {
      response.status(200).end()
      return
    }
    if (request.method !== 'GET') {
      response.status(405).end()
      return
    }

    // Validate token
    const authResult = validateToken(request)
    if (!authResult) {
      response.status(401).end()
      return
    }

    if (request.method === 'GET') {
      const notes = await prisma.note.findMany({
        where: {
          userId: authResult.userId,
          deletedAt: { not: { equals: null } }
        },
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          tasks: {
            select: {
              id: true,
              content: true,
              linkUrl: true,
              finishedAt: true,
              createdAt: true,
              updatedAt: true,
              index: true
            },
            orderBy: [{ createdAt: 'asc' }, { id: 'asc' }]
          }
        },
        orderBy: {
          deletedAt: 'desc'
        }
      })

      response.status(200).json({ notes: notes, count: notes.length })
    }
  } catch (error) {
    response.status(500).end(errorHandler(error))
  }
}

export default handler
