import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'

import { prisma } from '@/database'

import { createToken, errorHandler } from '@/utils'
import { ErrorModel, SuccessModel, JWTUserModel } from '@/interfaces'

import { LoginResult } from './_interfaces'
import { LOGIN_FAILED, LOGIN_SUCCESS } from './_constants'

const handler = async (
  request: NextApiRequest,
  response: NextApiResponse<(LoginResult & SuccessModel) | ErrorModel>
) => {
  try {
    if (request.method === 'OPTIONS') {
      response.status(200).end()
      return
    }
    if (request.method !== 'POST') {
      response.status(405).end()
      return
    }

    const { username, password } = request.body

    const user = await prisma.user.findFirst({
      where: {
        username: username,
        deletedAt: null
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        avatarUrl: true,
        biography: true,
        location: true,
        role: true,
        password: true
      }
    })

    if (!user) {
      response.status(400).json({ errorKey: LOGIN_FAILED })
      return
    }

    const { password: hashedPassword, ...userInfo } = user

    // Check the hashed password
    const checkPasswordSuccess = await bcrypt.compare(password, hashedPassword as string)
    if (!checkPasswordSuccess) {
      response.status(400).json({ errorKey: LOGIN_FAILED })
      return
    }

    // Generate JWT Token
    const jwtUserModel: JWTUserModel = {
      username: user.username,
      userId: user.id,
      role: user.role
    }
    const generatedToken = createToken(jwtUserModel)
    if (!generatedToken) {
      response.status(401).json({ errorKey: LOGIN_FAILED })
      return
    }

    response.status(200).json({
      successKey: LOGIN_SUCCESS,
      accessToken: generatedToken as string,
      user: userInfo
    })
  } catch (error) {
    response.status(500).end(errorHandler(error))
  }
}

export default handler
