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

    if (request.method !== 'PUT' && request.method !== 'DELETE') {
      response.status(405).end()
      return
    }

    // Validate token
    const authResult = validateToken(request)
    if (!authResult) {
      response.status(401).end()
      return
    }

    const { id: noteId } = request.query
    const { name, description, tasks: tasksData } = request.body

    if (!noteId || isNaN(Number(noteId)) || Number(noteId) <= 0) {
      response.status(400).end()
      return
    }

    if (request.method === 'PUT') {
      // Check whether the note has tasks
      if (tasksData && tasksData.length > 0) {
        const tasks = tasksData.map((task: any) => {
          return {
            id: task.id,
            content: task.content,
            linkUrl: task.linkUrl,
            finishedAt: task.finished ? new Date().toISOString() : null,
            deleted: task.deleted,
            created: task.created
          }
        })
        await prisma.note.update({
          where: { id: Number(noteId) },
          data: {
            name: name,
            description: description
          }
        })

        let deletedTaskIds: number[] = []
        let createdTasks: any[] = []

        await Promise.all([
          tasks.map(async (task: any): Promise<void> => {
            if (task.deleted) {
              deletedTaskIds.push(task.id)
            } else if (task.created) {
              createdTasks.push({
                content: task.content,
                linkUrl: task.linkUrl,
                finishedAt: task.finishedAt,
                noteId: Number(noteId)
              })
            } else {
              await prisma.task.updateMany({
                where: {
                  id: task.id
                },
                data: {
                  content: task.content,
                  linkUrl: task.linkUrl,
                  finishedAt: task.finishedAt,
                  noteId: Number(noteId)
                }
              })
            }
          })
        ])

        await prisma.task.deleteMany({
          where: { id: { in: deletedTaskIds } }
        })
        await prisma.task.createMany({
          data: createdTasks
        })
      } else {
        await prisma.note.update({
          where: { id: Number(noteId) },
          data: {
            name: name,
            description: description,
            tasks: { deleteMany: {} }
          }
        })
      }

      response.status(200).end()
      return
    } else if (request.method === 'DELETE') {
      const { count } = await prisma.note.updateMany({
        where: {
          id: Number(noteId)
        },
        data: {
          deletedAt: new Date().toISOString()
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
