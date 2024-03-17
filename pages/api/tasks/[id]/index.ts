import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '@/database'

import { errorHandler, validateToken } from '@/utils'
import { ErrorModel, SuccessModel } from '@/interfaces'

const handler = async (
  request: NextApiRequest,
  response: NextApiResponse<SuccessModel | ErrorModel>
) => {
  try {
    if (request.method === 'OPTIONS') {
      response.status(200).end()
      return
    }

    if (request.method !== 'PUT') {
      response.status(405).end()
      return
    }

    // Validate token
    const authResult = validateToken(request)
    if (!authResult) {
      response.status(401).end()
      return
    }

    const { id: taskId } = request.query
    const { finished } = request.body

    if (!taskId || isNaN(Number(taskId)) || Number(taskId) <= 0) {
      response.status(400).end()
      return
    }

    if (request.method === 'PUT') {
      const { count } = await prisma.task.updateMany({
        where: { id: Number(taskId) },
        data: {
          finishedAt: finished ? new Date().toISOString() : null
        }
      })

      if (count === 0) {
        response.status(404).end()
        return
      }

      response.status(200).end()
      return
    }
  } catch (error) {
    response.status(500).end(errorHandler(error))
  }
}

export default handler
